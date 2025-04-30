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
    const SESSION_TTL_SECONDS = 3600; // 1 hour session validity

    try {
        // 1. Parse incoming JSON data
        let userDataInput;
        try {
            userDataInput = await request.json();
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const { name, email, walletNumber } = userDataInput;

        // 2. Basic Input Validation
        if (!name || typeof name !== 'string' || name.trim() === '' ||
            !email || typeof email !== 'string' || !email.includes('@') ||
            !walletNumber || typeof walletNumber !== 'string' || walletNumber.trim() === '') {
            return new Response(JSON.stringify({ error: 'Missing or invalid input fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedWalletNumber = walletNumber.trim();

        // 3. Look up user in USER_KV using WalletNumber
        const storedUserDataJson = await USER_KV.get(trimmedWalletNumber);

        if (!storedUserDataJson) {
            console.log(`Login attempt failed: Wallet number not found - ${trimmedWalletNumber}`);
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // 4. Parse stored user data and verify email
        let storedUserData;
        try {
            storedUserData = JSON.parse(storedUserDataJson);
        } catch (parseError) {
            console.error(`Failed to parse user data for wallet ${trimmedWalletNumber}:`, parseError);
            return new Response(JSON.stringify({ error: 'Internal server error during user data parsing' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        if (!storedUserData.email || typeof storedUserData.email !== 'string') {
             console.error(`Stored user data for wallet ${trimmedWalletNumber} is missing or has invalid email.`);
             return new Response(JSON.stringify({ error: 'Internal server error - invalid user record configuration' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const storedEmail = storedUserData.email.trim().toLowerCase();

        if (storedEmail !== trimmedEmail) {
            console.log(`Login attempt failed: Email mismatch for wallet ${trimmedWalletNumber}`);
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        // 5. Check for existing sessions and invalidate them
        const existingSessionTokenJson = await ACTIVE_SESSION_MAP.get(trimmedEmail);
        if (existingSessionTokenJson) {
            try {
                // Parse the existing session token
                const existingSessionToken = JSON.parse(existingSessionTokenJson);
                if (existingSessionToken) {
                    // Delete the existing session
                    await SESSION_KV.delete(existingSessionToken);
                    console.log(`Deleted previous session token for ${trimmedEmail}: ${existingSessionToken}`);
                }
            } catch (parseError) {
                console.error(`Failed to parse existing session token for ${trimmedEmail}:`, parseError);
                // Continue with the login process anyway
            }
        }

        // 6. Create New Session
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

        console.log(`Stored new session mapping for ${trimmedEmail}: ${sessionToken}`);

        // 7. Prepare Response - Set HttpOnly Cookie
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append(
            'Set-Cookie',
            `session_token=${sessionToken}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}`
        );

        console.log(`Login successful for wallet ${trimmedWalletNumber}, email ${trimmedEmail}`);
        return new Response(JSON.stringify({ message: 'Login successful' }), {
            status: 200,
            headers: headers
        });

    } catch (error) {
        console.error('Error in /api/login function:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
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
  return new Response('Method Not Allowed', { status: 405 });
} 
