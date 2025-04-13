// functions/api/verify-session.js

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
            } catch (e) { cookies[name] = parts.join('='); }
        }
    });
    return cookies;
}

/**
 * Handles GET requests to /api/verify-session
 * Checks the session_token cookie against SESSION_KV_BINDING.
 * If valid, retrieves user email from USER_KV_BINDING and returns it.
 */
export async function onRequestGet(context) {
    try {
        const { request, env } = context;

        // Check bindings
        const userKv = env.USER_KV_BINDING;
        const sessionKv = env.SESSION_KV_BINDING;
        if (!userKv || !sessionKv) {
            console.error("[Verify Session] Missing KV bindings.");
            // Don't expose config errors to client unless necessary
            return new Response(JSON.stringify({ loggedIn: false, error: "Session check unavailable." }), { status: 503 }); // Service Unavailable
        }

        // Get session token from cookie
        const cookies = parseCookies(request);
        const sessionToken = cookies['session_token'];

        if (!sessionToken) {
            return new Response(JSON.stringify({ loggedIn: false }), { status: 200 }); // Not an error, just not logged in
        }

        // Validate session token by looking it up in Session KV
        let walletNumber;
        try {
            walletNumber = await sessionKv.get(sessionToken);
            if (!walletNumber) {
                console.log(`[Verify Session] Token ${sessionToken} not found in Session KV (expired/invalid).`);
                // Instruct browser to delete the invalid/expired session cookie
                 const deleteSessionCookie = `session_token=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax`;
                return new Response(JSON.stringify({ loggedIn: false, error: "Session expired or invalid." }), {
                    status: 200, // Return 200, but indicate not logged in
                    headers: { 'Set-Cookie': deleteSessionCookie }
                });
            }
            console.log(`[Verify Session] Token ${sessionToken} validated for wallet ${walletNumber}.`);
        } catch (kvError) {
            console.error(`[Verify Session] Error accessing Session KV for token ${sessionToken}:`, kvError);
            return new Response(JSON.stringify({ loggedIn: false, error: "Could not verify session." }), { status: 500 });
        }

        // Session is valid, get user email from User KV to display
        let userEmail = null;
        try {
             const storedUserDataString = await userKv.get(walletNumber);
             if (storedUserDataString) {
                 const storedUserData = JSON.parse(storedUserDataString);
                 userEmail = storedUserData.email || 'N/A';
             } else {
                  console.error(`[Verify Session] User data not found in User KV for validated wallet ${walletNumber}.`);
                  // Proceed without email, maybe handle differently
             }
        } catch (e) {
             console.error(`[Verify Session] Error fetching/parsing user data for wallet ${walletNumber}:`, e);
             // Proceed without email
        }

        // Return logged-in status and email
        return new Response(JSON.stringify({ loggedIn: true, email: userEmail }), {
             status: 200,
             headers: { 'Content-Type': 'application/json' }
         });

    } catch (error) {
        console.error("[Verify Session] Unexpected error:", error);
        return new Response(JSON.stringify({ loggedIn: false, error: "An unexpected error occurred." }), { status: 500 });
    }
}

// Handle other methods
export async function onRequest(context) {
    if (context.request.method === "GET") {
        return await onRequestGet(context);
    }
    return new Response(null, { status: 405 }); // Method Not Allowed
}
