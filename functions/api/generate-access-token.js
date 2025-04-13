// functions/api/generate-access-token.js

import jwt from 'jsonwebtoken';

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

/**
 * Handles POST requests to /api/generate-access-token
 * 1. Validates the session_token cookie using SESSION_KV_BINDING to get walletNumber.
 * 2. Checks permissions in USER_KV_BINDING based on requested file and walletNumber.
 * 3. Issues a short-lived JWT access_token cookie if permitted.
 */
export async function onRequestPost(context) {
    try {
        // --- 1. Get Request Context & Environment Variables ---
        const { request, env } = context;

        const userKv = env.USER_KV_BINDING;         // For user permissions
        const sessionKv = env.SESSION_KV_BINDING;   // For session validation
        const jwtSecret = env.SHARED_JWT_SECRET;    // For signing access token

        // Check required bindings and secrets
        if (!userKv || !sessionKv || !jwtSecret) {
            console.error("Missing required KV Bindings or JWT Secret.");
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
            // Look up the session token in the session KV store
            walletNumber = await sessionKv.get(sessionToken);

            if (!walletNumber) {
                // Session token not found in KV (either expired and TTL deleted it, or invalid)
                console.log(`Session validation failed: Token ${sessionToken} not found in Session KV.`);
                // Instruct browser to delete the invalid/expired session cookie
                 const deleteSessionCookie = `session_token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax`;
                 return new Response(JSON.stringify({ error: "Session expired or invalid. Please log in again." }), {
                     status: 401,
                     headers: {
                         'Content-Type': 'application/json',
                         'Set-Cookie': deleteSessionCookie
                     }
                 });
            }
            // If found, walletNumber now holds the user's ID for this session
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
            // This shouldn't happen if the session is valid, but good to check
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


        // --- 6. Generate Access Token JWT ("Admit Card") ---
        const expiresInSeconds = 7200; // 2 hours
        const jwtPayload = {
            sub: walletNumber, // Use walletNumber as subject (identifies user)
            file: `/${requestedFile}`, // File user is allowed to access
            // 'iat' (issued at) & 'exp' (expiration) are added by jwt.sign
        };

        const accessToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: expiresInSeconds });

        // --- 7. Set Access Token Cookie ---
        const accessCookie = `access_token=${accessToken}; HttpOnly; Secure; Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax`;

        // --- 8. Return Success Response ---
        console.log(`Issued access token for ${requestedFile} for wallet ${walletNumber}.`);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': accessCookie,
            },
        });

    } catch (error) {
        console.error("Error in /api/generate-access-token:", error);
        let errorMessage = "An unexpected server error occurred.";
        if (error instanceof jwt.JsonWebTokenError) {
            errorMessage = "Error generating access token.";
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
