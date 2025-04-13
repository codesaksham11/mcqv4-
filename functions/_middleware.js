// /functions/_middleware.js

// --- Helper Functions ---

// Cookie Parser (same as used before)
function getCookie(request, name) {
    let result = null;
    const cookieString = request.headers.get('Cookie');
    if (cookieString) {
        const cookies = cookieString.split(';');
        cookies.forEach(cookie => {
            const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
            // Handle potential __Host- prefix if used when setting the cookie
            const cleanCookieName = cookieName.startsWith('__Host-') ? cookieName.substring(7) : cookieName;
            if (cleanCookieName === name) {
                result = cookieValue;
            }
        });
    }
    return result;
}

// Base64 Decoder (UTF-8 safe) using TextDecoder and atob
function base64Decode(encodedStr) {
    try {
        // Standard Base64 decoding
        const binaryString = atob(encodedStr);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        // Decode using TextDecoder for UTF-8 support
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
    } catch (e) {
         console.error("Base64 decoding failed:", e);
        // Fallback for environments without TextDecoder (less likely)
        // This might mangle non-ASCII chars if the fallback in encoding was used
         try {
             return decodeURIComponent(escape(atob(encodedStr)));
         } catch (e2) {
            console.error("Base64 fallback decoding also failed:", e2);
             throw new Error("Failed to Base64 decode data."); // Re-throw if both fail
         }
    }
}


// --- Middleware Logic ---

export async function onRequest(context) {
    const { request, next, env } = context; // `next` is used to proceed to the next function or static asset
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Check if the requested path is one we need to protect
    // Only apply checks to files ending in '_mcq.html'
    if (!pathname.endsWith('_mcq.html')) {
        // Not a protected file, pass the request through without changes
        return await next();
    }

    // --- Protection Logic for *_mcq.html files ---
    console.log(`Middleware triggered for protected path: ${pathname}`);

    // 2. Get the access token cookie
    // Ensure the name matches exactly how it was set (check for __Host- prefix if you used it)
    const accessToken = getCookie(request, 'access_token');

    if (!accessToken) {
        console.log(`Access denied to ${pathname}: Missing access_token cookie.`);
        // Option 1: Redirect to login (or index)
        // return Response.redirect(new URL('/', request.url).toString(), 302);
        // Option 2: Return 403 Forbidden
        return new Response('Forbidden: Access token required.', { status: 403 });
    }

    // 3. Decode and Validate the token
    let payload;
    try {
        const decodedPayload = base64Decode(accessToken);
        payload = JSON.parse(decodedPayload);

        // Basic payload structure check
        if (!payload || typeof payload !== 'object' || !payload.exp || !payload.file || !payload.sub) {
             throw new Error("Invalid payload structure.");
        }

        // 4. Check Expiration
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        if (payload.exp <= now) {
            console.log(`Access denied to ${pathname}: Expired access token. Exp: ${payload.exp}, Now: ${now}`);
            // Optionally: Clear the expired cookie? Not strictly necessary, browser should handle Max-Age.
            return new Response('Forbidden: Access token expired.', { status: 403 });
        }

        // 5. Check File Match
        // Ensure the 'file' claim matches the requested path *exactly*
        // Pathname includes leading '/' so we compare '/path/file.html' with 'path/file.html'
        if (pathname !== `/${payload.file}`) {
            console.log(`Access denied to ${pathname}: Token file claim mismatch. Claim: ${payload.file}`);
            return new Response('Forbidden: Access token not valid for this file.', { status: 403 });
        }

        // --- Validation Passed ---
        console.log(`Access granted to ${pathname} for user ${payload.sub}. Token expires at ${payload.exp}`);

        // Add user identifier to the request context for potential use in later functions (if any)
        // This isn't strictly needed if we just serve static HTML, but good practice.
        context.data = context.data || {}; // Ensure context.data exists
        context.data.userId = payload.sub;
        context.data.requestedFile = payload.file;

        // 6. Allow access to the requested static file (_mcq.html)
        return await next();

    } catch (error) {
        // Handle errors during decoding/parsing (malformed token)
        console.error(`Access denied to ${pathname}: Error processing access token -`, error);
        return new Response('Forbidden: Invalid access token format.', { status: 403 });
    }
}
