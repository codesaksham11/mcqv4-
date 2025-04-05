export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);

    if (url.pathname === '/mcq.html') {
        const level = url.searchParams.get('level');
        const token = context.request.headers.get('X-Token') || 'false'; // Simulated from localStorage via client-side header
        if (!level || token !== 'true' || !['see', 'basic', 'ktm'].includes(level)) {
            return Response.redirect(`${url.origin}/index.html`, 302);
        }
    }

    return next();
}
