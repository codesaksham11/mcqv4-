// functions/_middleware.js 

// Import the jsonwebtoken library
import jwt from 'jsonwebtoken';

// List of paths to protect with this middleware
// IMPORTANT: Must match the paths used in links and tokens exactly
const protectedPaths = [
    '/see_mcq.html',
    '/basic_mcq.html',
    '/ktm_mcq.html'
    // Add any other specific HTML files you want to protect here
];

// Helper to parse cookies (same as used in other functions)
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

/**
 * Middleware function executed for requests in the root directory and subdirectories.
 * Checks for a valid access_token JWT for specific protected paths.
 */
export async function onRequest(context) {
    const { request, next, env } = context;
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- 1. Check if the path needs protection ---
    if (!protectedPaths.includes(pathname)) {
        // Not a protected path, pass the request through
        return await next();
    }

    // --- 2. Path IS protected, proceed with checks ---
    console.log(`Middleware: Protecting path ${pathname}`);

    // Get the JWT secret from environment variables
    const jwtSecret = env.SHARED_JWT_SECRET;
    if (!jwtSecret) {
        console.error("Middleware Error: SHARED_JWT_SECRET environment variable not set.");
        return new Response("Server configuration error.", { status: 500 });
    }

    // --- 3. Extract Access Token Cookie ---
    const cookies = parseCookies(request);
    const accessToken = cookies['access_token'];

    if (!accessToken) {
        console.log(`Middleware: Access denied to ${pathname}. Missing access_token cookie.`);
        // Option 1: Return Forbidden error
        // return new Response("Access Denied: Token missing.", { status: 403 });
        // Option 2: Redirect to login (or relevant setup page?) - More complex to determine which setup page
        // For now, let's redirect to the main index page, user needs to log in / get token again.
        // Create a redirect response to the root/index page
        return Response.redirect(url.origin + '/', 302); // 302 Found redirect
    }

    // --- 4. Verify the JWT Access Token ---
    try {
        // Verify signature and expiration. Throws error if invalid.
        const decoded = jwt.verify(accessToken, jwtSecret);

        // --- 5. Check File Claim ---
        // Ensure the token was specifically issued for the requested file
        if (decoded.file !== pathname) {
            console.log(`Middleware: Access denied to ${pathname}. Token is for '${decoded.file}'.`);
            // This prevents using a token for basic_mcq.html to access see_mcq.html
             return new Response(`Access Denied: Invalid token for this resource.`, { status: 403 });
        }

        // --- 6. Token is Valid for this file ---
        console.log(`Middleware: Access granted to ${pathname}. Token verified.`);
        // Proceed to serve the requested file
        return await next();

    } catch (error) {
        // Handle JWT verification errors (expired, invalid signature, malformed etc.)
        console.log(`Middleware: Access denied to ${pathname}. JWT verification failed: ${error.message}`);

        let message = "Access Denied: Invalid or expired access token.";
        if (error.name === 'TokenExpiredError') {
            message = "Access Denied: Your access session for this exam has expired. Please return to the setup page to start again.";
        } else if (error.name === 'JsonWebTokenError') {
             message = "Access Denied: Invalid access token signature.";
        }

        // Option 1: Return Forbidden error with specific message
        return new Response(message, { status: 403 });
        // Option 2: Redirect to index/login (same as missing token)
        // return Response.redirect(url.origin + '/', 302);
    }
}
