// functions/_middleware.js
// CORRECTED VERSION WITHOUT JWT VERIFICATION - Double Checked

// List of paths to protect
const protectedPaths = [
    '/see_mcq.html',
    '/basic_mcq.html',
    '/ktm_mcq.html'
    // Add any other specific HTML files you want to protect here
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
                console.warn(`[Middleware - No JWT] Could not decode cookie part: ${name}`);
                cookies[name] = parts.join('=');
             }
        }
    });
    return cookies;
}

// Helper to Base64 decode (URL safe)
function base64UrlDecode(str) {
    try {
        // Requires nodejs_compat flag for Buffer
        str = str.replace(/-/g, '+').replace(/_/g, '/'); // Convert back from URL safe
        while (str.length % 4) { // Add padding if needed
            str += '=';
        }
        return Buffer.from(str, 'base64').toString('utf8');
    } catch (e) {
        console.error("[Middleware - No JWT] Base64 decoding failed:", e);
        return null; // Indicate failure
    }
}

/**
 * Middleware function (NO JWT VERSION)
 * Checks for an access_token cookie, decodes it (Base64), and validates claims.
 */
export async function onRequest(context) {
    const { request, next, env } = context; // env not needed here unless used for logging levels etc.
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- 1. Check if path needs protection ---
    if (!protectedPaths.includes(pathname)) {
        // Not protected, allow request to proceed
        return await next();
    }

    // --- 2. Path IS protected ---
    console.log(`[Middleware - No JWT] Protecting path ${pathname}`);
    // No JWT secret needed

    // --- 3. Extract Access Token Cookie ---
    const cookies = parseCookies(request);
    const accessTokenValue = cookies['access_token']; // Base64 encoded string

    if (!accessTokenValue) {
        console.log(`[Middleware - No JWT] Access denied to ${pathname}. Missing access_token cookie.`);
        // Redirect to home/login page as access token is required
        return Response.redirect(url.origin + '/', 302);
    }

    // --- 4. Decode the Base64 Access Token ---
    let decodedPayload;
    const decodedString = base64UrlDecode(accessTokenValue);

    if (!decodedString) {
        console.log(`[Middleware - No JWT] Failed to decode Base64 token for ${pathname}.`);
        return new Response("Access Denied: Invalid token format.", { status: 403 });
    }

    try {
        // Parse the decoded string as JSON
        decodedPayload = JSON.parse(decodedString);
    } catch (e) {
        console.log(`[Middleware - No JWT] Failed to parse JSON from decoded token for ${pathname}. Content: ${decodedString}`);
        return new Response("Access Denied: Invalid token data.", { status: 403 });
    }

    // --- 5. Validate Claims from Decoded Payload ---
    if (!decodedPayload || typeof decodedPayload !== 'object') {
         console.log(`[Middleware - No JWT] Decoded token is not a valid object for ${pathname}.`);
         return new Response("Access Denied: Malformed token.", { status: 403 });
    }

    // Check Expiration
    const now = Math.floor(Date.now() / 1000); // Current time in seconds since epoch
    if (!decodedPayload.exp || typeof decodedPayload.exp !== 'number' || decodedPayload.exp <= now) {
        console.log(`[Middleware - No JWT] Access denied to ${pathname}. Token expired or invalid expiry. Exp: ${decodedPayload.exp}, Now: ${now}`);
        // Give specific message for expired token
        return new Response("Access Denied: Your access session for this exam has expired. Please return to the setup page to start again.", { status: 403 });
    }

    // Check File Claim
    if (decodedPayload.file !== pathname) {
        console.log(`[Middleware - No JWT] Access denied to ${pathname}. Token is for '${decodedPayload.file}', not the requested path.`);
        return new Response(`Access Denied: Invalid token for this specific resource.`, { status: 403 });
    }

    // --- 6. Claims Valid (NO SIGNATURE CHECK) ---
    console.log(`[Middleware - No JWT] Access GRANTED to ${pathname} based on token claims (UNSIGNED). User: ${decodedPayload.sub}`);
    // Allow the original request to proceed to Cloudflare Pages
    return await next();

} // End onRequest
