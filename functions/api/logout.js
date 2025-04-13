// /functions/api/logout.js

// Re-use the same helper function to parse cookies
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
    const SESSION_KV = env.SESSION_KV_BINDING;

    try {
        // 1. Get the session token from the cookie
        const sessionToken = getCookie(request, 'session_token');

        // 2. If a token exists, attempt to delete it from KV
        if (sessionToken) {
            // No need to check if it exists first, delete is idempotent.
            // Use await to ensure deletion attempt completes before responding.
            await SESSION_KV.delete(sessionToken);
            console.log(`Logout processed for session token (attempted delete): ${sessionToken}`);
        } else {
            console.log('Logout endpoint called, but no session token cookie found.');
        }

        // 3. Prepare response headers to clear the cookie
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // Set Max-Age to 0 to expire the cookie immediately
        headers.append(
            'Set-Cookie',
            `session_token=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`
        );

        // 4. Send response indicating successful logout process
        return new Response(JSON.stringify({ message: 'Logout successful' }), {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Error in /api/logout function:', error);
        // Even if KV delete fails, we should still try to clear the cookie
        // Prepare response headers to clear the cookie
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(
            'Set-Cookie',
            `session_token=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`
        );
         // Return an error status but still clear the cookie
        return new Response(JSON.stringify({ error: 'Internal Server Error during logout' }), {
            status: 500,
            headers: headers // Still include cookie clearing header
        });
    }
}

// Optional: Catch-all for non-POST requests
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  return new Response('Method Not Allowed', { status: 405 });
}
