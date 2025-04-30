// /functions/api/logout.js

// Helper function to parse cookies
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

export async function onRequestPost(context) {
    // Handles only POST requests.
    const { request, env } = context;

    // KV Bindings - Added ACTIVE_SESSION_MAP
    const SESSION_KV = env.SESSION_KV_BINDING;
    const ACTIVE_SESSION_MAP = env.ACTIVE_SESSION_MAP; // Make sure this binding exists

    // Check if necessary bindings are present
    if (!SESSION_KV || !ACTIVE_SESSION_MAP) {
        console.error("Missing KV Bindings! Ensure SESSION_KV_BINDING and ACTIVE_SESSION_MAP are bound.");
        // Even with configuration error, try to clear the cookie
        const headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('Set-Cookie', `session_token=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`);
        return new Response(JSON.stringify({ error: 'Server configuration error during logout' }), { status: 500, headers: headers });
    }

    let userEmail = null; // Variable to store the email if found

    try {
        // 1. Get the session token from the cookie
        const sessionToken = getCookie(request, 'session_token');

        // 2. If a token exists, attempt to retrieve session data & delete from KV stores
        if (sessionToken) {
            // --- START: MODIFIED LOGIC ---

            // A. Get session data (specifically the email) BEFORE deleting the session
            const sessionDataJson = await SESSION_KV.get(sessionToken);
            if (sessionDataJson) {
                try {
                    const sessionData = JSON.parse(sessionDataJson);
                    // Check if email exists in the session data (it should, based on our modified login.js)
                    if (sessionData && sessionData.email) {
                        userEmail = sessionData.email;
                        console.log(`Logout initiated for session token ${sessionToken}, associated email: ${userEmail}`);
                    } else {
                        console.warn(`Session data found for token ${sessionToken} but email is missing.`);
                    }
                } catch (parseError) {
                    console.error(`Failed to parse session data for token ${sessionToken} during logout:`, parseError);
                    // Proceed with deleting the token anyway
                }
            } else {
                console.log(`Logout requested for token ${sessionToken}, but session data not found in SESSION_KV (likely expired or invalid).`);
            }

            // B. Delete the session from SESSION_KV (regardless of whether email was found)
            // Use await to ensure deletion attempt completes before responding.
            await SESSION_KV.delete(sessionToken);
            console.log(`Deleted session token from SESSION_KV: ${sessionToken}`);

            // C. If we found the user's email, delete their entry from ACTIVE_SESSION_MAP
            if (userEmail) {
                await ACTIVE_SESSION_MAP.delete(userEmail);
                console.log(`Deleted session mapping from ACTIVE_SESSION_MAP for email: ${userEmail}`);
            } else {
                console.log(`Skipping ACTIVE_SESSION_MAP delete as email was not retrieved for token: ${sessionToken}`);
            }

            // --- END: MODIFIED LOGIC ---

        } else {
            console.log('Logout endpoint called, but no session token cookie found.');
        }

        // 3. Prepare response headers to clear the cookie (No change here)
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // Set Max-Age to 0 to expire the cookie immediately
        headers.append(
            'Set-Cookie',
            `session_token=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`
        );

        // 4. Send response indicating successful logout process (No change here)
        return new Response(JSON.stringify({ message: 'Logout successful' }), {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Error in /api/logout function:', error);
        // Even if KV delete fails, we should still try to clear the cookie
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(
            'Set-Cookie',
            `session_token=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`
        );
        return new Response(JSON.stringify({ error: 'Internal Server Error during logout' }), {
            status: 500,
            headers: headers // Still include cookie clearing header
        });
    }
}

// Optional: Catch-all for non-POST requests (No change)
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  return new Response('Method Not Allowed', { status: 405 });
} 
