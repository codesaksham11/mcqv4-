// functions/_worker.js

// This file configures the Worker environment for all functions in this directory.

export default {
  // Set the compatibility date
  compatibility_date: "2024-04-13", // Use a recent date

  // Explicitly enable Node.js compatibility flags
  compatibility_flags: ["nodejs_compat"],

  // The 'fetch' handler is still defined by the individual function files
  // (like api/login.js, _middleware.js) based on the request route.
  // We don't need a fetch handler here unless we want a default catch-all.
  // async fetch(request, env, ctx) {
  //  return new Response("Default _worker.js response");
  // }
};
