// functions/api/login.js

/**
 * Handles POST requests to /api/login
 * Verifies user credentials (email, walletNumber) against Cloudflare KV.
 * Sets an HttpOnly session cookie on success.
 */
export async function onRequestPost(context) {
    try {
        // --- 1. Get Request Data & Environment ---
        const { request, env } = context;

        // Check if the KV binding exists
        const kvBinding = env.USER_KV_BINDING; // Use the binding name you configured
        if (!kvBinding) {
            console.error("KV Binding 'USER_KV_BINDING' not found in environment.");
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
                status: 400, // Bad Request
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { email, walletNumber } = requestBody;

        // --- 3. Validate Input ---
        if (!email || !walletNumber) {
            return new Response(JSON.stringify({ error: "Missing email or wallet number." }), {
                status: 400, // Bad Request
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Basic email format check (optional but recommended)
        if (!/\S+@\S+\.\S+/.test(email)) {
             return new Response(JSON.stringify({ error: "Invalid email format." }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 4. Look Up User in KV ---
        console.log(`Login attempt: Wallet=${walletNumber}, Email=${email}`); // Log attempt (optional)
        const storedUserDataString = await kvBinding.get(walletNumber);

        if (!storedUserDataString) {
            console.log(`Login failed: Wallet number ${walletNumber} not found in KV.`);
            return new Response(JSON.stringify({ error: "Invalid credentials." }), {
                status: 401, // Unauthorized
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 5. Parse Stored Data & Verify Email ---
        let storedUserData;
        try {
            storedUserData = JSON.parse(storedUserDataString);
        } catch (e) {
            console.error(`Failed to parse stored JSON for wallet ${walletNumber}:`, storedUserDataString, e);
            return new Response(JSON.stringify({ error: "Server error processing user data." }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Compare emails (case-insensitive for robustness)
        if (!storedUserData.email || email.toLowerCase() !== storedUserData.email.toLowerCase()) {
             console.log(`Login failed: Email mismatch for wallet ${walletNumber}. Provided: ${email}, Stored: ${storedUserData.email}`);
             return new Response(JSON.stringify({ error: "Invalid credentials." }), {
                status: 401, // Unauthorized
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- 6. Credentials Valid - Generate Session Token ---
        // Generate a secure random string for the session token
        const sessionToken = crypto.randomUUID(); // Built-in secure UUID generator
        console.log(`Login successful for wallet ${walletNumber}. Issuing session token.`);

        // --- 7. Prepare Response with Secure Cookie ---
        const cookieMaxAgeSeconds = 86400; // 24 hours
        const cookie = `session_token=${sessionToken}; HttpOnly; Secure; Path=/; Max-Age=${cookieMaxAgeSeconds}; SameSite=Lax`;

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Set-Cookie': cookie,
        });

        // --- 8. Return Success Response ---
        return new Response(JSON.stringify({ success: true }), {
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

// Optional: Handle other methods if needed, otherwise Cloudflare defaults to 405
export async function onRequest(context) {
  if (context.request.method === "POST") {
    return await onRequestPost(context);
  }
  // Return 405 Method Not Allowed for other methods like GET, PUT, DELETE etc.
  return new Response(null, { status: 405 });
}
