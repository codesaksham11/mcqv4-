// File: /functions/_middleware.js

/**
 * Cloudflare Pages Middleware to protect quiz routes based on cookies.
 */

// Helper function to parse cookies from the request header
function parseCookies(cookieHeader) {
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts[0]?.trim();
      const value = parts[1]?.trim();
      if (name) {
        cookies[name] = value;
      }
    });
  }
  return cookies;
}

// Define which pages require which cookie
const protectedRoutes = {
  '/see_mcq.html': 'code_see',
  '/basic_mcq.html': 'code_basic', // Assuming this will be the next one
  '/ktm_mcq.html': 'code_ktm',     // Assuming this will be the next one
  // Add other protected routes here if needed, e.g., results pages?
  // '/see_result.html': 'code_see', // Example if results also need protection
};

// The middleware function itself
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Check if the requested path is one we need to protect
  const requiredCookieName = protectedRoutes[pathname];

  if (requiredCookieName) {
    // This route is protected, check for the cookie
    const cookieHeader = request.headers.get('Cookie');
    const cookies = parseCookies(cookieHeader);

    // Check if the required cookie exists and has the value 'true'
    if (cookies[requiredCookieName] === 'true') {
      // Authorized: Cookie found and valid, proceed to the requested page
      console.log(`Access granted to ${pathname} via cookie ${requiredCookieName}`);
      return next(); // Let the request go through to the static HTML file
    } else {
      // Unauthorized: Cookie missing or invalid
      console.log(`Access denied to ${pathname}. Required cookie '${requiredCookieName}' not found or invalid.`);

      // --- Return a custom HTML response for unauthorized access ---
      const unauthorizedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Access Denied</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(135deg, #f6d365 0%, #fda085 100%); /* Warm, cautionary gradient */
                    color: #333;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    text-align: center;
                    padding: 20px;
                    margin: 0;
                }
                .container {
                    background-color: rgba(255, 255, 255, 0.9);
                    padding: 40px 50px;
                    border-radius: 15px;
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                    max-width: 500px;
                }
                h1 {
                    color: #d9534f; /* Error red */
                    margin-bottom: 15px;
                }
                p {
                    font-size: 1.1em;
                    margin-bottom: 30px;
                    color: #555;
                }
                a.button {
                    display: inline-block;
                    padding: 12px 25px;
                    background: linear-gradient(45deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1em;
                    font-weight: 600;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                a.button:hover {
                    background: linear-gradient(45deg, #5a6fd5, #673f93);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Access Denied</h1>
                <p>You do not have the required access for this section. Please purchase or activate the respective package first!</p>
                <a href="/index.html" class="button">← Go to Portal Home</a>
            </div>
        </body>
        </html>
      `;

      // Return the custom HTML page with a 403 Forbidden status
      return new Response(unauthorizedHtml, {
        status: 403, // Forbidden
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }

  // If the route is not in protectedRoutes, let the request pass through
  // This allows access to index.html, CSS, JS files, etc.
  return next();
}
