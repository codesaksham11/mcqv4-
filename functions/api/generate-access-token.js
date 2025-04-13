// functions/api/generate-access-token.js
// VERSION WITHOUT JWT SIGNATURES - LESS SECURE - ADDED LOGGING

import jwt from 'jsonwebtoken'; // Keep import if using JWT later, otherwise remove

// Helper to parse cookies
function parseCookies(request) { /* ... (keep function as before) ... */
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
                cookies[name] = parts.join('=');
            }
        }
    });
    return cookies;
}
// Helper to Base64 encode
function base64UrlEncode(str) { /* ... (keep function as before) ... */
  try {
      return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
      console.error("Buffer or Base64 encoding failed:", e);
      return null;
  }
}


export async function onRequestPost(context) {
    console.log("[Generate Token] Function invoked."); // <-- LOG Start
    try {
        // --- 1. Get Request Context & Environment Variables ---
        const { request, env } = context;
        // ... (rest of env checks as before) ...
        const userKv = env.USER_KV_BINDING;
        const sessionKv = env.SESSION_KV_BINDING;
        if (!userKv || !sessionKv ) { /* ... error handling ... */
            console.error("[Generate Token] Missing required KV Bindings.");
            return new Response(JSON.stringify({ error: "Server configuration error." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 2. Parse Request Body ---
        // ... (request body parsing as before) ...
         let requestBody;
         try {
             requestBody = await request.json();
         } catch (e) { /* ... error handling ... */
             return new Response(JSON.stringify({ error: "Invalid request body." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
         }
         const { requestedFile } = requestBody;
         console.log(`[Generate Token] Requested file: ${requestedFile}`); // <-- LOG Requested File
         if (!requestedFile || typeof requestedFile !== 'string' || !requestedFile.endsWith('.html')) { /* ... error handling ... */
             return new Response(JSON.stringify({ error: "Missing or invalid 'requestedFile' parameter." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
         }


        // --- 3. Get Session Token from Cookie ---
        const cookies = parseCookies(request);
        const sessionToken = cookies['session_token'];
        console.log(`[Generate Token] Raw Cookie Header:`, request.headers.get('Cookie')); // <-- LOG Raw Cookie Header
        console.log(`[Generate Token] Parsed session_token from cookie: ${sessionToken}`); // <-- LOG Parsed Token

        if (!sessionToken) {
            console.log("[Generate Token] Access token request denied: Missing session_token cookie."); // <-- LOG Missing
            return new Response(JSON.stringify({ error: "Authentication required. Please log in." }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // --- 4. Validate Session Token & Get Wallet Number from Session KV ---
        let walletNumber;
        try {
            console.log(`[Generate Token] Attempting Session KV get with key: ${sessionToken}`); // <-- LOG before KV get
            walletNumber = await sessionKv.get(sessionToken);
            console.log(`[Generate Token] Result from Session KV get for key ${sessionToken}:`, walletNumber); // <-- LOG after KV get

            if (!walletNumber) { // Check if null or undefined
                console.log(`[Generate Token] Session validation failed: Token ${sessionToken} NOT FOUND in Session KV.`); // <-- LOG Not Found
                 const deleteSessionCookie = `session_token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax`;
                 return new Response(JSON.stringify({ error: "Session expired or invalid. Please log in again." }), {
                     status: 401,
                     headers: { 'Content-Type': 'application/json', 'Set-Cookie': deleteSessionCookie }
                 });
            }
             console.log(`[Generate Token] Session validated successfully. Associated wallet: ${walletNumber}`); // <-- LOG Success

        } catch (kvError) {
             console.error(`[Generate Token] Error DURING Session KV get for token ${sessionToken}:`, kvError); // <-- LOG KV Error
             return new Response(JSON.stringify({ error: "Server error validating session." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }


        // --- 5. Check Permissions in User KV ---
        // ... (Permission check logic remains the same) ...
        let requiredPackage = null;
        if (requestedFile.startsWith('basic_')) requiredPackage = 'basic';
        else if (requestedFile.startsWith('see_')) requiredPackage = 'see';
        else if (requestedFile.startsWith('ktm_')) requiredPackage = 'ktm';

        if (!requiredPackage) { /* ... error handling ... */
             console.log(`[Generate Token] Permission check failed: No package defined for file ${requestedFile}.`);
             return new Response(JSON.stringify({ error: `Configuration error: Invalid file requested.` }), { status: 400, headers: { 'Content-Type': 'application/json' }});
        }

        console.log(`[Generate Token] Attempting User KV get for wallet: ${walletNumber}`); // <-- LOG before User KV get
        const storedUserDataString = await userKv.get(walletNumber);
        console.log(`[Generate Token] Result from User KV get for wallet ${walletNumber}:`, storedUserDataString ? '(data found)' : '(data NOT found)'); // <-- LOG after User KV get

        if (!storedUserDataString) { /* ... error handling ... */
            console.error(`[Generate Token] Data integrity issue: User data not found in User KV for validated wallet ${walletNumber}.`);
            return new Response(JSON.stringify({ error: "User data inconsistency. Please contact support." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
        }
         try {
            const storedUserData = JSON.parse(storedUserDataString);
            if (!storedUserData.packages || !Array.isArray(storedUserData.packages) || !storedUserData.packages.includes(requiredPackage)) { /* ... error handling ... */
                 console.log(`[Generate Token] Permission DENIED for wallet ${walletNumber} to access ${requestedFile} (needs package '${requiredPackage}', has ${JSON.stringify(storedUserData.packages)})`);
                 return new Response(JSON.stringify({ error: `Permission denied. Access to '${requiredPackage}' package required.` }), { status: 403, headers: { 'Content-Type': 'application/json' }});
            }
             console.log(`[Generate Token] Permission GRANTED for wallet ${walletNumber} to access ${requestedFile}.`);
         } catch(e) { /* ... error handling ... */
              console.error(`[Generate Token] Failed to parse User KV data for wallet ${walletNumber}:`, storedUserDataString, e);
              return new Response(JSON.stringify({ error: "Server error processing permissions." }), { status: 500, headers: { 'Content-Type': 'application/json' }});
         }


        // --- 6. Generate UNSIGNED Access Token Payload & Encode ---
        // ... (Payload generation and encoding as before) ...
        const expiresInSeconds = 7200;
        const expirationTimestamp = Math.floor(Date.now() / 1000) + expiresInSeconds;
        const tokenPayload = { sub: walletNumber, file: `/${requestedFile}`, exp: expirationTimestamp };
        const accessTokenValue = base64UrlEncode(JSON.stringify(tokenPayload));
        if (!accessTokenValue) { /* ... error handling ... */
             console.error("[Generate Token] Failed to Base64 encode the access token payload.");
             return new Response(JSON.stringify({ error: "Failed to generate access token." }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }


        // --- 7. Set Access Token Cookie ---
        const accessCookie = `access_token=${accessTokenValue}; HttpOnly; Secure; Path=/; Max-Age=${expiresInSeconds}; SameSite=Lax`;

        // --- 8. Return Success Response ---
        console.log(`[Generate Token] Issued UNSIGNED access token for ${requestedFile} for wallet ${walletNumber}.`); // <-- LOG Success
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Set-Cookie': accessCookie },
        });

    } catch (error) {
        console.error("[Generate Token] UNEXPECTED error:", error); // <-- LOG Unexpected Error
        // ... (rest of catch block) ...
        let errorMessage = "An unexpected server error occurred.";
         if (error instanceof SyntaxError) { errorMessage = "Invalid request format."; }
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Optional: Handle other methods
export async function onRequest(context) { /* ... (keep as before) ... */
    if (context.request.method === "POST") {
        return await onRequestPost(context);
    }
    return new Response(null, { status: 405 });
}
