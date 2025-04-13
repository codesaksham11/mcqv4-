// functions/api/login.js

/**
 * Handles POST requests to /api/login
 * Verifies user credentials (email, walletNumber) against USER_KV_BINDING.
 * Creates a session token, stores it in SESSION_KV_BINDING with expiry,
 * and sets it as an HttpOnly session cookie.
 */
export async function onRequestPost(context) {
    try {
        // --- 1. Get Request Data & Environment ---
        const { request, env } = context;

        // Check if BOTH KV bindings exist
        const userKv = env.USER_KV_BINDING;
        const sessionKv = env.SESSION_KV_BINDING; // The new binding for session data

        if (!userKv || !sessionKv) {
            console.error("Missing required KV Bindings (USER_KV_BINDING or SESSION_KV_BINDING).");
            return new Response(JSON.stringify({ error: "Server configuration error." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 2. Parse Request Body ---
        let requestBody;
        try {
            requestBody = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ error: "Invalid request body. Expected JSON." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { email, walletNumber } = requestBody;

        // --- 3. Validate Input ---
        if (!email || !walletNumber) {
            return new Response(JSON.stringify({ error: "Missing email or wallet number." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
             return new Response(JSON.stringify({ error: "Invalid email format." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 4. Look Up User in User KV ---
        console.log(`Login attempt: Wallet=${walletNumber}, Email=${email}`);
        const storedUserDataString = await userKv.get(walletNumber);

        if (!storedUserDataString) {
            console.log(`Login failed: Wallet number ${walletNumber} not found in User KV.`);
            return new Response(JSON.stringify({ error: "Invalid credentials." }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 5. Parse Stored Data & Verify Email ---
        let storedUserData;
        try {
            storedUserData = JSON.parse(storedUserDataString);
        } catch (e) {
            console.error(`Failed to parse stored user JSON for wallet ${walletNumber}:`, storedUserDataString, e);
            return new Response(JSON.stringify({ error: "Server error processing user data." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!storedUserData.email || email.toLowerCase() !== storedUserData.email.toLowerCase()) {
             console.log(`Login failed: Email mismatch for wallet ${walletNumber}. Provided: ${email}, Stored: ${storedUserData.email}`);
             return new Response(JSON.stringify({ error: "Invalid credentials." }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 6. Credentials Valid - Generate Session Token ---
        const sessionToken = crypto.randomUUID(); // Secure random string
        const sessionDurationSeconds = 86400; // 24 hours validity for the session token in KV

        // --- 7. Store Session Token in Session KV ---
        // Store the walletNumber associated with this session token.
        // Set expiration TTL (Time To Live) in KV so it automatically expires.
        try {
            await sessionKv.put(sessionToken, walletNumber, {
                expirationTtl: sessionDurationSeconds, // Automatically delete after this many seconds
            });
            console.log(`Stored session token ${sessionToken} for wallet ${walletNumber} in Session KV.`);
        } catch (kvError) {
             console.error(`Failed to store session token in Session KV for wallet ${walletNumber}:`, kvError);
             // Decide if login should fail if session can't be stored
             return new Response(JSON.stringify({ error: "Failed to initiate session." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }


        // --- 8. Prepare Response with Secure Cookie ---
        // The cookie lifetime can match the KV TTL or be shorter (session cookie)
        const cookieMaxAgeSeconds = sessionDurationSeconds;
        const cookie = `session_token=${sessionToken}; HttpOnly; Secure; Path=/; Max-Age=${cookieMaxAgeSeconds}; SameSite=Lax`;

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
        });

        // --- 9. Return Success Response ---
        console.log(`Login successful for wallet ${walletNumber}. Issuing session cookie.`);
        return new Response(JSON.stringify({ success: true, email: storedUserData.email }), { // Optionally return email
            status: 200,
            headers: headers,
        });

    } catch (error) {
        // --- Catch-all Error Handling ---
        console.error("Error during login process:", error);
        return new Response(JSON.stringify({ error: "An unexpected server error occurred." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// Optional: Handle other methods if needed
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  return new Response(null, { status: 405 });
}
