// functions/api/generate-access-token.js
// CORRECTED VERSION WITHOUT JWT - Double Checked

// Helper to parse cookies
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
                console.warn(`[Generate Token - No JWT] Could not decode cookie part: ${name}`);
                cookies[name] = parts.join('=');
            }
        }
    });
    return cookies;
}

// Helper to Base64 encode (URL safe)
function base64UrlEncode(str) {
  try {
      // Requires nodejs_compat flag for Buffer
      return Buffer.from(str)
          .toString('base64')
          .replace(/\+/g, '-') // Replace + with -
          .replace(/\//g, '_') // Replace / with _
          .replace(/=+$/, ''); // Remove trailing =
  } catch (e) {
      console.error("[Generate Token - No JWT] Buffer or Base64 encoding failed:", e);
      // Indicate failure - this relies on Buffer being available via nodejs_compat
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
    console.log("[Generate Token - No JWT] Function invoked.");
    try {
        // --- 1. Get Request Context & Environment Variables ---
        const { request, env } = context;
        const userKv = env.USER_KV_BINDING;
        const sessionKv = env.SESSION_KV_BINDING;
        // No JWT Secret needed

        if (!userKv || !sessionKv) {
            console.error("[Generate Token - No JWT] Missing required KV Bindings.");
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
        console.log(`[Generate Token - No JWT] Requested file: ${requestedFile}`);

        if (!requestedFile || typeof requestedFile !== 'string' || !requestedFile.endsWith('.html')) {
             return new Response(JSON.stringify({ error: "Missing or invalid 'requestedFile' parameter." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 3. Get Session Token from Cookie ---
        const cookies = parseCookies(request);
        const sessionToken = cookies['session_token'];
        console.log(`[Generate Token - No JWT] Parsed session_token from cookie: ${sessionToken}`);

        if (!sessionToken) {
            console.log("[Generate Token - No JWT] Access denied: Missing session_token cookie.");
            return new Response(JSON.stringify({ error: "Authentication required. Please log in." }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 4. Validate Session Token & Get Wallet Number from Session KV ---
        let walletNumber;
        try {
            console.log(`[Generate Token - No JWT] Attempting Session KV get with key: ${sessionToken}`);
            walletNumber = await sessionKv.get(sessionToken); // This returns the stored value (walletNumber) or null
            console.log(`[Generate Token - No JWT] Result from Session KV get for key ${sessionToken}:`, walletNumber);

            if (!walletNumber) { // Check if null or undefined (meaning token not found or expired)
                console.log(`[Generate Token - No JWT] Session validation failed: Token ${sessionToken} NOT FOUND in Session KV.`);
                 const deleteSessionCookie = `session_token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax`;
                 return new Response(JSON.stringify({ error: "Session expired or invalid. Please log in again." }), {
                     status: 401,
                     headers: { 'Content-Type': 'application/json', 'Set-Cookie': deleteSessionCookie }
                 });
            }
             console.log(`[Generate Token - No JWT] Session validated successfully. Associated wallet: ${walletNumber}`);

        } catch (kvError) {
             console.error(`[Generate Token - No JWT] Error DURING Session KV get for token ${sessionToken}:`, kvError);
             return new Response(JSON.stringify({ error: "Server error validating session." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }

        // --- 5. Check Permissions in User KV ---
        let requiredPackage = null;
        if (requestedFile.startsWith('basic_')) requiredPackage = 'basic';
        else if (requestedFile.startsWith('see_')) requiredPackage = 'see';
        else if (requestedFile.startsWith('ktm_')) requiredPackage = 'ktm';

        if (!requiredPackage) {
             console.log(`[Generate Token - No JWT] Permission check failed: No package defined for file ${requestedFile}.`);
             return new Response(JSON.stringify({ error: `Configuration error: Invalid file requested.` }), { status: 400, headers: { 'Content-Type': 'application/json' }});
        }

        console.log(`[Generate Token - No JWT] Attempting User KV get for wallet: ${walletNumber}`);
        const storedUserDataString = await userKv.get(walletNumber);
        console.log(`[Generate Token - No JWT] Result from User KV get for wallet ${walletNumber}:`, storedUserDataString ? '(data found)' : '(data NOT found)');

        if (!storedUserDataString) {
            console.error(`[Generate Token - No JWT] Data integrity issue: User data not found for wallet ${walletNumber}.`);
            return new Response(JSON.stringify({ error: "User data inconsistency." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }
         try {
            const storedUserData = JSON.parse(storedUserDataString);
            if (!storedUserData.packages || !Array.isArray(storedUserData.packages) || !storedUserData.packages.includes(requiredPackage)) {
                 console.log(`[Generate Token - No JWT] Permission DENIED for wallet ${walletNumber} to access ${requestedFile} (needs '${requiredPackage}')`);
                 return new Response(JSON.stringify({ error: `Permission denied. Access to '${requiredPackage}' package required.` }), { status: 403, headers: { 'Content-Type': 'application/json' }});
            }
             console.log(`[Generate Token - No JWT] Permission GRANTED for wallet ${walletNumber} to access ${requestedFile}.`);
         } catch(e) {
              console.error(`[Generate Token - No JWT] Failed to parse User KV data for wallet ${walletNumber}:`, storedUserDataString, e);
              return new Response(JSON.stringify({ error: "Server error processing permissions." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
         }

        // --- 6. Generate UNSIGNED Access Token Payload & Encode ---
        const expiresInSeconds = 7200; // 2 hours
        const expirationTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
        const tokenPayload = { sub: walletNumber, file: `/${requestedFile}`, exp: expirationTimestamp };
        const accessTokenValue = base64UrlEncode(JSON.stringify(tokenPayload));

        if (!accessTokenValue) {
             console.error("[Generate Token - No JWT] Failed to Base64 encode payload.");
             return new Response(JSON.stringify({ error: "Failed to generate access token." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 7. Set Access Token Cookie ---
        const accessCookie = `access_token=${accessTokenValue}; HttpOnly; Secure; Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax`;

        // --- 8. Return Success Response ---
        console.log(`[Generate Token - No JWT] Issued UNSIGNED access token for ${requestedFile} for wallet ${walletNumber}.`);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Set-Cookie': accessCookie },
        });

    } catch (error) {
        console.error("[Generate Token - No JWT] UNEXPECTED error:", error);
        let errorMessage = "An unexpected server error occurred.";
         if (error instanceof SyntaxError) { errorMessage = "Invalid request format."; }
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  return new Response(null, { status: 405 });
}
