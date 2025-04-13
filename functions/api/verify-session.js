// /functions/api/verify-session.js

// Helper function to parse cookies (simplified)
function getCookie(request, name) {
    let result = null;
    const cookieString = request.headers.get('Cookie');
    if (cookieString) {
        const cookies = cookieString.split(';');
        cookies.forEach(cookie => {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            if (cookieName === name) {
                result = cookieValue;
            }
        });
    }
    return result;
}

export async function onRequest(context) {
    // Environment variables are accessible via context.env
    const { request, env } = context;

    // KV bindings
    const SESSION_KV = env.SESSION_KV_BINDING;
    const USER_KV = env.USER_KV_BINDING;

    // Only handle GET requests for session verification
    if (request.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    try {
        // 1. Get the session token from the cookie
        const sessionToken = getCookie(request, 'session_token');

        if (!sessionToken) {
            // No token, user is not logged in
            return new Response(JSON.stringify({ loggedIn: false }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200 // It's not an error, just not logged in
            });
        }

        // 2. Look up the session token in SESSION_KV
        const sessionDataJson = await SESSION_KV.get(sessionToken);

        if (!sessionDataJson) {
            // Token exists but is not valid (expired or bogus)
            // Optionally: Clear the bad cookie? For simplicity, we won't here.
             return new Response(JSON.stringify({ loggedIn: false }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        // 3. Parse session data (which includes walletNumber and name)
        const sessionData = JSON.parse(sessionDataJson);
        const { walletNumber, name } = sessionData;

        if (!walletNumber || !name) {
             console.error(`Incomplete session data for token: ${sessionToken}`);
             return new Response(JSON.stringify({ loggedIn: false }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200 // Treat incomplete session as logged out
            });
        }

        // 4. Look up user data in USER_KV using walletNumber to get the email
        const userDataJson = await USER_KV.get(walletNumber);

        if (!userDataJson) {
             // Session exists, but the underlying user record is gone! Invalidate session.
             console.error(`User data not found for walletNumber: ${walletNumber} from valid session token: ${sessionToken}`);
             // Delete the orphaned session token
             await SESSION_KV.delete(sessionToken);
             return new Response(JSON.stringify({ loggedIn: false }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        // 5. Parse user data to get the email
        const userData = JSON.parse(userDataJson);
        const email = userData.email; // Assuming email is stored in USER_KV value

        if (!email) {
            console.error(`Email not found in USER_KV for walletNumber: ${walletNumber}`);
             // User data exists but is missing email - treat as invalid state
             return new Response(JSON.stringify({ loggedIn: false }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        // 6. If all checks pass, return loggedIn: true with user details
        return new Response(JSON.stringify({
            loggedIn: true,
            email: email,
            name: name // Get name from session data
        }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error) {
        console.error('Error in /api/verify-session:', error);
        // Return logged out state in case of any server error
        return new Response(JSON.stringify({ loggedIn: false, error: 'Internal Server Error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500 // Use 500 for actual server errors
        });
    }
}
