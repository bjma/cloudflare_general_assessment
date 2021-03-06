// LinkTree data; global so we can access from either endpoint
const data = [
    {name: "Budgit (personal project currently in development)", url: "https://github.com/bjma/budgit"},
    {name: "Algorithm Design Notes (self-authored and distributed for free)", url: "https://github.com/bjma/algorithms"},
    {name: "Tune into my cooking journey on Instagram!", url: "https://www.instagram.com/freshjingjer/"},
];

addEventListener('fetch', event => {
    event.respondWith(new Promise((resolve, reject) => {
        let url = new URL(event.request.url);
        // Request handler to respond to the path '/links'; returns data as JSON
        if (url.pathname == '/links') {
            resolve(handleLinkRequest(event.request));
        } else { // Request handler for path that isn't '/links'
            fetch('https://static-links-page.signalnerve.workers.dev') // retrive static HTML page
            .then((response) => { 
                resolve(handleHTMLRequest(event.request, response)); // Add links to HTML page and returns transformed HTML page as response
            });
        }
    }));
});

/**
 * Handles requests from path '/links' and returns array as JSON.
 * Includes header displaying attribute 'Content-Type'.
 * @param {Request} request HTTP request
 * @return {Response}       Array of objects as JSON string
 */
async function handleLinkRequest(request) { 
    try {
        return new Response(JSON.stringify(data), {
            headers: {"Content-Type": "application/json"}
        });
    } catch (err) {
        console.log(err.message);
    }
}

/**
 * Adds links from data array into static HTML page using HTMLRewriter
 * @param {Request} request HTTP request
 * @param {Response} html   Static HTML page fetched from url; going to be rewritten
 */
async function handleHTMLRequest(request, html) {
    try {
        // Get links as LinkHandler
        const linkHandler = new LinkHandler(data);
        // Rewrite HTML content
        const rewriter = new HTMLRewriter()
            .on("div#links", linkHandler)                  // Add links to our HTML page
            .on("div#profile", {element: (element) => {    // Remove 'display: none' from 'div#profile' 
                element.removeAttribute("style");          // Update element object by removing selected attribute
            }})
            .on("img#avatar", {element: (element) => {     // Add avatar to 'img#avatar' in 'div#profile'
                element.setAttribute("src", "https://avatars1.githubusercontent.com/u/26337572?s=400&u=f5f7637acc46ae0139fac1014fad3a1cb23ce9ad&v=4");
            }})
            .on("h1#name", {element: (element) => {        // Add name to 'h1#name'
                element.setInnerContent("Brian Ma");
            }});
        // Extra Credit
        const socialHandler = new SocialHandler();
        rewriter.on("div#social", {element: (element) => { // Remove 'display:none' from 'div#social'
            element.removeAttribute("style");
        }})
        .on("div#social", socialHandler)                   // Then add our socials with links and icons
        .on("title", {element: (element) => {              // Change title content
            element.setInnerContent("Brian Ma");
        }})
        .on("body", {element: (element) => {               // Change background color
            element.setAttribute("class", "bg-teal-400");
        }});
        // Add header to ensure correct content type, and return transformed HTML
        rewriter.headers = {"Content-Type": "text/html;charset=UTF-8"};
        return rewriter.transform(html);
    } catch (err) {
        console.log(err.message);
    }
}

// Handles links for LinkTree to be used for HTMLRewrite
class LinkHandler {
    constructor(links) {
        this.links = links;
    }
    // Creates the element that we're going to add into the HTML static page
    async element(element) {
        this.links.forEach((link) => {
            // Append each link as an HTML <a> tag 
            element.append(`<a href="${link.url}">${link.name}</a>`, {html:true});
        });
        return element;
    }
    // Testing our LinkHandler class
    printLinks() {
        this.links.forEach((link) => console.log(link));
    }
}

// Handles social links to be used for HTMLRewrite
class SocialHandler {
    // Have array of social links local to the SocialHandler scope since it doesn't need to be globally accessed, unlike our links
    constructor() {
        this.socials = [
            {url: "https://www.linkedin.com/in/brian-j-ma/", icon: "https://simpleicons.org/icons/linkedin.svg"},
            {url: "https://github.com/bjma/", icon: "https://simpleicons.org/icons/github.svg"},
            {url: "https://www.instagram.com/freshjingjer", icon: "https://simpleicons.org/icons/instagram.svg"}
        ]
    }
    async element(element) {
        const ICON_SIZE = 36;
        this.socials.forEach((social) => {
            element.append(`<a href="${social.url}"><svg width="${ICON_SIZE}" height="${ICON_SIZE}"><image width="${ICON_SIZE}" height="${ICON_SIZE}" xlink:href="${social.icon}"/></svg></a>`, {html:true});
        })
    }
    // Testing SocialHandler class
    printSocials() {
        this.socials.forEach((social) => console.log(social));
    }
}