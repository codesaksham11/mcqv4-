// functions/_middleware.js
// VERSION WITHOUT JWT VERIFICATION - LESS SECURE

// List of paths to protect with this middleware
const protectedPaths = [
    '/see_mcq.html',
    '/basic_mcq.html',
    '/ktm_mcq.html'
];

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
             } catch(e) {
                cookies[name] = parts.join('=');
             }
        }
    });
    return cookies;
}

// Helper to Base64 decode (URL safe) - using standard Buffer assuming nodejs_compat works for Buffer
function base64UrlDecode(str) {
    try {
        // Replace URL safe chars, add padding if needed, then decode Base64 to Buffer, then to UTF8 string
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        while (str.length % 4) {
            str += '=';
        }
        return Buffer.from(str, 'base64').toString('utf8');
    } catch (e) {
        console.error("Base64 decoding failed:", e);
        return null; // Indicate failure
    }
}


/**
 * Middleware function (NO JWT VERSION)
 * Checks for an access_token cookie, decodes it (Base64), and validates claims.
 */
export async function onRequest(context) {
    const { request, next, env } = context; // env might not be strictly needed here anymore
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- 1. Check if the path needs protection ---
    if (!protectedPaths.includes(pathname)) {
        return await next(); // Pass through if not protected
    }

    // --- 2. Path IS protected ---
    console.log(`Middleware (No JWT): Protecting path ${pathname}`);
    // No JWT secret needed

    // --- 3. Extract Access Token Cookie ---
    const cookies = parseCookies(request);
    const accessTokenValue = cookies['access_token']; // The Base64 encoded string

    if (!accessTokenValue) {
        console.log(`Middleware (No JWT): Access denied to ${pathname}. Missing access_token cookie.`);
        // Redirect to login/index page
        return Response.redirect(url.origin + '/', 302);
    }

    // --- 4. Decode the Base64 Access Token ---
    let decodedPayload;
    const decodedString = base64UrlDecode(accessTokenValue);

    if (!decodedString) {
        console.log(`Middleware (No JWT): Failed to decode Base64 token for ${pathname}.`);
        // Treat as invalid token
        return new Response("Access Denied: Invalid token format.", { status: 403 });
    }

    try {
        // Parse the decoded string as JSON
        decodedPayload = JSON.parse(decodedString);
    } catch (e) {
        console.log(`Middleware (No JWT): Failed to parse JSON from decoded token for ${pathname}. Content: ${decodedString}`);
        return new Response("Access Denied: Invalid token data.", { status: 403 });
    }

    // --- 5. Validate Claims from Decoded Payload ---
    if (!decodedPayload || typeof decodedPayload !== 'object') {
         console.log(`Middleware (No JWT): Decoded token is not a valid object for ${pathname}.`);
         return new Response("Access Denied: Malformed token.", { status: 403 });
    }

    // Check Expiration
    const now = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
    if (!decodedPayload.exp || typeof decodedPayload.exp !== 'number' || decodedPayload.exp <= now) {
        console.log(`Middleware (No JWT): Access denied to ${pathname}. Token expired or invalid expiry. Exp: ${decodedPayload.exp}, Now: ${now}`);
        // Optionally redirect differently for expired tokens
        return new Response("Access Denied: Your access session for this exam has expired. Please return to the setup page to start again.", { status: 403 });
    }

    // Check File Claim
    if (decodedPayload.file !== pathname) {
        console.log(`Middleware (No JWT): Access denied to ${pathname}. Token is for '${decodedPayload.file}'.`);
        return new Response(`Access Denied: Invalid token for this resource.`, { status: 403 });
    }

    // --- 6. Token Claims are Valid (Expiration and File Match) ---
    // **NO SIGNATURE VERIFICATION IS PERFORMED**
    console.log(`Middleware (No JWT): Access GRANTED to ${pathname} based on token claims (UNSIGNED). User: ${decodedPayload.sub}`);
    // Proceed to serve the requested file
    return await next();

} // End onRequest
