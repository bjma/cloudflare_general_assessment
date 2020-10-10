addEventListener('fetch', event => {
    /*event.respondWith(new Promise((resolve, reject) => {
        // Get url of request
        let url = new URL(event.request.url);
        // Request handler to respond to the path '/links'; returns data as JSON
        if (url.pathname == '/links') {
            resolve(handleLinkRequests(events.request));
        }
    })) */
    event.respondWith(handleLinkRequests(event.request));
})

// LinkTree data
const data = [
    {name : "LinkedIn", url : "https://www.linkedin.com/in/brian-j-ma/"},
    {name : "GitHub", url : "https://github.com/bjma/"},
    {name : "Reddit", url : "https://www.reddit.com/"},
]

/**
 * Handles requests from path '/links' and returns array as JSON.
 * Includes header displaying attribute 'Content-Type'.
 */
async function handleLinkRequests(request) { 
    try {
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type' : 'application/json'}
        });
    } catch (err) {
        console.log('Exit with error code:', err);
    }
}
