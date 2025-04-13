// functions/api/generate-access-token.js
// VERSION WITHOUT JWT SIGNATURES - LESS SECURE

// Helper to parse cookies from the Request headers
function parseCookies(request) {
    const cookieHeader = request.headers.get('Cookie');
    if (!cookieHeader) return {};
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        const name = parts.shift().trim();
        if (name) {
            try {
                cookies[name] = decodeURIComponent(parts.join('='));
            } catch (e) {
                console.warn(`Could not decode cookie part: ${name}`);
                cookies[name] = parts.join('='); // Use raw value
            }
        }
    });
    return cookies;
}

// Helper to Base64 encode (URL safe) - using standard Buffer assuming nodejs_compat works for Buffer
function base64UrlEncode(str) {
  try {
      // Convert string to Buffer, then to Base64, then make it URL safe
      return Buffer.from(str)
          .toString('base64')
          .replace(/\+/g, '-') // Replace + with -
          .replace(/\//g, '_') // Replace / with _
          .replace(/=+$/, ''); // Remove trailing =
  } catch (e) {
      console.error("Buffer or Base64 encoding failed:", e);
      // Fallback or throw error - For now, return null to indicate failure
      return null;
  }
}


/**
 * Handles POST requests to /api/generate-access-token (NO JWT VERSION)
 * 1. Validates the session_token cookie using SESSION_KV_BINDING to get walletNumber.
 * 2. Checks permissions in USER_KV_BINDING based on requested file and walletNumber.
 * 3. Issues a short-lived, Base64-encoded (UNSIGNED) access_token cookie if permitted.
 */
export async function onRequestPost(context) {
    try {
        // --- 1. Get Request Context & Environment Variables ---
        const { request, env } = context;

        const userKv = env.USER_KV_BINDING;         // For user permissions
        const sessionKv = env.SESSION_KV_BINDING;   // For session validation
        // No JWT Secret needed in this version

        // Check required bindings
        if (!userKv || !sessionKv) {
            console.error("Missing required KV Bindings.");
            return new Response(JSON.stringify({ error: "Server configuration error." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 2. Parse Request Body ---
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid request body." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        const { requestedFile } = requestBody;

        if (!requestedFile || typeof requestedFile !== 'string' || !requestedFile.endsWith('.html')) {
            return new Response(JSON.stringify({ error: "Missing or invalid 'requestedFile' parameter." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 3. Get Session Token from Cookie ---
        const cookies = parseCookies(request);
        const sessionToken = cookies['session_token'];

        if (!sessionToken) {
            console.log("Access token request denied: Missing session_token cookie.");
            return new Response(JSON.stringify({ error: "Authentication required. Please log in." }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 4. Validate Session Token & Get Wallet Number from Session KV ---
        let walletNumber;
        try {
            walletNumber = await sessionKv.get(sessionToken);
            if (!walletNumber) {
                console.log(`Session validation failed: Token ${sessionToken} not found in Session KV.`);
                 const deleteSessionCookie = `session_token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax`;
                 return new Response(JSON.stringify({ error: "Session expired or invalid. Please log in again." }), {
                     status: 401,
                     headers: { 'Content-Type': 'application/json', 'Set-Cookie': deleteSessionCookie }
                 });
            }
             console.log(`Session validated for token ${sessionToken}. Associated wallet: ${walletNumber}`);
        } catch (kvError) {
             console.error(`Error accessing Session KV for token ${sessionToken}:`, kvError);
             return new Response(JSON.stringify({ error: "Server error validating session." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }


        // --- 5. Check Permissions in User KV using the Validated Wallet Number ---
        let requiredPackage = null;
        if (requestedFile.startsWith('basic_')) requiredPackage = 'basic';
        else if (requestedFile.startsWith('see_')) requiredPackage = 'see';
        else if (requestedFile.startsWith('ktm_')) requiredPackage = 'ktm';

        if (!requiredPackage) {
             console.log(`Permission check failed: No package defined for file ${requestedFile}.`);
             return new Response(JSON.stringify({ error: `Configuration error: Invalid file requested.` }), { status: 400, headers: { 'Content-Type': 'application/json' }});
        }

        const storedUserDataString = await userKv.get(walletNumber);
        if (!storedUserDataString) {
            console.error(`Data integrity issue: User data not found in User KV for validated wallet ${walletNumber}.`);
            return new Response(JSON.stringify({ error: "User data inconsistency. Please contact support." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }

        try {
           const storedUserData = JSON.parse(storedUserDataString);
           if (!storedUserData.packages || !Array.isArray(storedUserData.packages) || !storedUserData.packages.includes(requiredPackage)) {
               console.log(`Permission denied for wallet ${walletNumber} to access ${requestedFile} (needs package '${requiredPackage}', has ${JSON.stringify(storedUserData.packages)})`);
               return new Response(JSON.stringify({ error: `Permission denied. Access to '${requiredPackage}' package required.` }), { status: 403, headers: { 'Content-Type': 'application/json' }}); // 403 Forbidden
           }
            console.log(`Permission granted for wallet ${walletNumber} to access ${requestedFile}.`);
        } catch(e) {
            console.error(`Failed to parse User KV data for wallet ${walletNumber}:`, storedUserDataString, e);
            return new Response(JSON.stringify({ error: "Server error processing permissions." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }


        // --- 6. Generate UNSIGNED Access Token Payload & Encode ---
        const expiresInSeconds = 7200; // 2 hours
        const expirationTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds; // Expires in 2 hours (seconds since epoch)

        const tokenPayload = {
            sub: walletNumber,         // User identifier (wallet number)
            file: `/${requestedFile}`, // File allowed
            exp: expirationTimestamp   // Expiration timestamp
        };

        // Convert payload to JSON string, then Base64 encode it (URL safe)
        const accessTokenValue = base64UrlEncode(JSON.stringify(tokenPayload));

        if (!accessTokenValue) {
             // Handle encoding failure (rare, but possible if Buffer isn't available)
             console.error("Failed to Base64 encode the access token payload.");
             return new Response(JSON.stringify({ error: "Failed to generate access token." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 7. Set Access Token Cookie ---
        const accessCookie = `access_token=${accessTokenValue}; HttpOnly; Secure; Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax`;

        // --- 8. Return Success Response ---
        console.log(`Issued UNSIGNED access token for ${requestedFile} for wallet ${walletNumber}.`);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': accessCookie,
            },
        });

    } catch (error) {
        // --- Catch-all Error Handling ---
        console.error("Error in /api/generate-access-token:", error);
        let errorMessage = "An unexpected server error occurred.";
         if (error instanceof SyntaxError) { // Likely from request.json()
             errorMessage = "Invalid request format.";
         }
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Optional: Handle other HTTP methods
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  return new Response(null, { status: 405 });
}
