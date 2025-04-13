// /functions/api/generate-access-token.js

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

// Helper for Base64 encoding (UTF-8 safe) using TextEncoder and btoa
function base64Encode(str) {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        // Convert Uint8Array to binary string
        let binaryString = '';
        for (let i = 0; i < data.length; i++) {
            binaryString += String.fromCharCode(data[i]);
        }
        return btoa(binaryString);
    } catch (e) {
        console.error("Base64 encoding failed:", e);
        // Fallback for environments without TextEncoder (less likely in modern CF Workers)
        // This fallback might mangle non-ASCII characters
        try {
             return btoa(unescape(encodeURIComponent(str)));
        } catch (e2) {
            console.error("Base64 fallback encoding also failed:", e2);
            throw new Error("Failed to Base64 encode data."); // Re-throw if both fail
        }
    }
}


export async function onRequestPost(context) {
    // Handles only POST requests
    const { request, env } = context;

    // KV Bindings
    const SESSION_KV = env.SESSION_KV_BINDING;
    const USER_KV = env.USER_KV_BINDING;

    // Constants
    const ACCESS_TOKEN_TTL_SECONDS = 300; // 5 minutes validity for the access token

    try {
        // --- Step 1: Verify Session Token ---
        const sessionToken = getCookie(request, 'session_token');
        if (!sessionToken) {
            console.log('Generate token failed: No session token cookie found.');
            return new Response(JSON.stringify({ error: 'Unauthorized - No session found' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const sessionDataJson = await SESSION_KV.get(sessionToken);
        if (!sessionDataJson) {
            console.log(`Generate token failed: Session token invalid/expired - ${sessionToken}`);
             return new Response(JSON.stringify({ error: 'Unauthorized - Invalid session' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        let sessionData;
        try {
            sessionData = JSON.parse(sessionDataJson);
        } catch(e) {
             console.error(`Failed to parse session data for token ${sessionToken}:`, e);
             // Delete potentially corrupted session data
             await SESSION_KV.delete(sessionToken);
             return new Response(JSON.stringify({ error: 'Unauthorized - Session data corrupted' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const { walletNumber } = sessionData; // Get wallet number from valid session
        if (!walletNumber) {
            console.error(`Generate token failed: Wallet number missing in session data for token ${sessionToken}`);
            return new Response(JSON.stringify({ error: 'Unauthorized - Incomplete session data' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // --- Step 2: Parse Request Body ---
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const { requestedFile, requiredPackage } = requestBody;

        if (!requestedFile || typeof requestedFile !== 'string' || !requestedFile.endsWith('_mcq.html') ||
            !requiredPackage || typeof requiredPackage !== 'string') {
            console.log('Generate token failed: Invalid request body parameters - file:', requestedFile, 'package:', requiredPackage);
            return new Response(JSON.stringify({ error: 'Bad Request - Missing or invalid file/package name' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        // --- Step 3: Check User Permissions ---
        const userDataJson = await USER_KV.get(walletNumber);
        if (!userDataJson) {
            // This case is less likely if session is valid, but handle defensively
            console.error(`Generate token failed: User data not found for wallet ${walletNumber} (linked from valid session ${sessionToken})`);
            return new Response(JSON.stringify({ error: 'Forbidden - User record not found' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        let userData;
         try {
            userData = JSON.parse(userDataJson);
        } catch (parseError) {
            console.error(`Failed to parse user data for wallet ${walletNumber}:`, parseError);
            return new Response(JSON.stringify({ error: 'Internal server error during user data parsing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        // Check if user has the required package
        if (!userData.packages || !Array.isArray(userData.packages) || !userData.packages.includes(requiredPackage)) {
            console.log(`Generate token failed: Permission denied for wallet ${walletNumber} to access package ${requiredPackage}. User packages: ${JSON.stringify(userData.packages)}`);
            return new Response(JSON.stringify({ error: `Forbidden - Access denied to package '${requiredPackage}'` }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        // --- Step 4: Generate Access Token Payload ---
        const expirationTime = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS;
        const payload = {
            sub: walletNumber,       // Subject (user identifier)
            file: requestedFile,     // File this token grants access to
            pkg: requiredPackage,    // Package permission verified (optional, for logging/debug)
            exp: expirationTime      // Expiration time (Unix timestamp)
        };

        // --- Step 5: Base64 Encode Payload ---
        const jsonPayload = JSON.stringify(payload);
        const encodedPayload = base64Encode(jsonPayload); // Use safe encoder

        // --- Step 6: Set Cookie and Respond ---
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(
            'Set-Cookie',
            // Use __Host- prefix for extra security if your site is exclusively HTTPS
            // Requires Path=/ and Secure attributes.
            // `__Host-access_token=${encodedPayload}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${ACCESS_TOKEN_TTL_SECONDS}`
            // Or without prefix:
             `access_token=${encodedPayload}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${ACCESS_TOKEN_TTL_SECONDS}`
        );

        console.log(`Access token generated for wallet ${walletNumber}, file ${requestedFile}`);
        return new Response(JSON.stringify({ message: 'Access token generated successfully' }), {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Error in /api/generate-access-token function:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
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
