// /functions/api/login.js

// Helper function to generate secure random token (using standard Web Crypto API)
function generateSessionToken() {
    return crypto.randomUUID();
}

export async function onRequestPost(context) {
    const { request, env } = context;

    // KV Bindings
    const USER_KV = env.USER_KV_BINDING;
    const SESSION_KV = env.SESSION_KV_BINDING;
    const ACTIVE_SESSION_MAP = env.ACTIVE_SESSION_MAP;

    // Check if necessary bindings are present
    if (!USER_KV || !SESSION_KV || !ACTIVE_SESSION_MAP) {
        console.error("Missing KV Bindings! Ensure USER_KV_BINDING, SESSION_KV_BINDING, and ACTIVE_SESSION_MAP are bound.");
        return new Response(JSON.stringify({ error: 'Server configuration error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Constants
    const SESSION_TTL_SECONDS = 16848000; // 1 hour session validity

    try {
        // Log start of request handling
        console.log("Starting login request processing");
        
        // 1. Parse incoming JSON data
        let userDataInput;
        try {
            userDataInput = await request.json();
        } catch (error) {
            console.error("JSON parsing error:", error.message);
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        // Extract forceLogin flag
        const { name, email, walletNumber, forceLogin = false } = userDataInput;
        console.log(`Login attempt: ${email}, walletNumber: ${walletNumber.substring(0, 4)}***, forceLogin: ${forceLogin}`);
        
        // 2. Basic Input Validation
        if (!name || typeof name !== 'string' || name.trim() === '' ||
            !email || typeof email !== 'string' || !email.includes('@') ||
            !walletNumber || typeof walletNumber !== 'string' || walletNumber.trim() === '') {
            console.log("Input validation failed");
            return new Response(JSON.stringify({ error: 'Missing or invalid input fields' }), { 
                status: 400, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedWalletNumber = walletNumber.trim();

        // 3. Look up user in USER_KV using WalletNumber
        const storedUserDataJson = await USER_KV.get(trimmedWalletNumber);

        if (!storedUserDataJson) {
            console.log(`Login attempt failed: Wallet number not found - ${trimmedWalletNumber.substring(0, 4)}***`);
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        // 4. Parse stored user data and verify email
        let storedUserData;
        try {
            storedUserData = JSON.parse(storedUserDataJson);
        } catch (parseError) {
            console.error(`Failed to parse user data for wallet ${trimmedWalletNumber.substring(0, 4)}***:`, parseError);
            return new Response(JSON.stringify({ error: 'Internal server error during user data parsing' }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        if (!storedUserData.email || typeof storedUserData.email !== 'string') {
            console.error(`Stored user data for wallet ${trimmedWalletNumber.substring(0, 4)}*** is missing or has invalid email.`);
            return new Response(JSON.stringify({ error: 'Internal server error - invalid user record configuration' }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        const storedEmail = storedUserData.email.trim().toLowerCase();

        if (storedEmail !== trimmedEmail) {
            console.log(`Login attempt failed: Email mismatch for wallet ${trimmedWalletNumber.substring(0, 4)}***`);
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
                status: 401, 
                headers: { 'Content-Type': 'application/json' } 
            });
        }

        // 5. Check for existing sessions
        const existingSessionTokenJson = await ACTIVE_SESSION_MAP.get(trimmedEmail);

        // Handle existing session based on forceLogin flag
        if (existingSessionTokenJson) {
            console.log(`Existing session found for email: ${trimmedEmail}`);
            
            if (!forceLogin) {
                // Existing session found, and forceLogin is false - signal conflict
                console.log(`Returning 409 Conflict for email: ${trimmedEmail}`);
                return new Response(JSON.stringify({
                    conflict: true,
                    message: 'This email is already logged in on another device or browser.'
                }), { 
                    status: 409, 
                    headers: { 'Content-Type': 'application/json' } 
                });
            } else {
                // Force login is true - proceed to invalidate the old session
                console.log(`Force login requested for email: ${trimmedEmail}. Invalidating previous session.`);
                try {
                    const existingSessionToken = JSON.parse(existingSessionTokenJson);
                    if (existingSessionToken) {
                        await SESSION_KV.delete(existingSessionToken);
                        console.log(`Deleted previous session token from SESSION_KV: ${existingSessionToken}`);
                    }
                    // Delete from ACTIVE_SESSION_MAP regardless of parsing success
                    await ACTIVE_SESSION_MAP.delete(trimmedEmail);
                    console.log(`Deleted previous session mapping from ACTIVE_SESSION_MAP for ${trimmedEmail}`);
                } catch (parseError) {
                    console.error(`Failed to parse or delete existing session for ${trimmedEmail}:`, parseError);
                    // Attempt to delete from ACTIVE_SESSION_MAP anyway as a cleanup
                    await ACTIVE_SESSION_MAP.delete(trimmedEmail);
                }
            }
        }

        // 6. Create New Session (Now runs if no existing session OR if forceLogin was true)
        const sessionToken = generateSessionToken();
        const sessionData = {
            walletNumber: trimmedWalletNumber,
            name: trimmedName,
            email: trimmedEmail // Add email to session data
        };

        // Store the session token -> session data mapping in KV with TTL
        await SESSION_KV.put(sessionToken, JSON.stringify(sessionData), {
            expirationTtl: SESSION_TTL_SECONDS
        });

        // Add mapping to ACTIVE_SESSION_MAP KV
        await ACTIVE_SESSION_MAP.put(trimmedEmail, JSON.stringify(sessionToken), {
            expirationTtl: SESSION_TTL_SECONDS
        });

        console.log(`Stored new session mapping for ${trimmedEmail}: ${sessionToken.substring(0, 8)}***`);

        // 7. Prepare Response - Set HttpOnly Cookie
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(
            'Set-Cookie',
            `session_token=${sessionToken}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`
        );

        console.log(`Login successful for wallet ${trimmedWalletNumber.substring(0, 4)}***, email ${trimmedEmail} (Forced: ${forceLogin})`);
        return new Response(JSON.stringify({ 
            message: 'Login successful',
            status: 'success'
        }), {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Error in /api/login function:', error);
        return new Response(JSON.stringify({ 
            error: 'Internal Server Error',
            details: error.message 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Optional: Add handlers for other methods if needed, or a catch-all
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  
  // Make sure we respond properly to OPTIONS requests for CORS
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  
  return new Response('Method Not Allowed', { status: 405 });
}
