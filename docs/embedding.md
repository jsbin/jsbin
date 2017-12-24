# Embed

User includes `http://jsbin.com/js/embed.js` in their code - probably in the footer - it runs one doc ready. As a user I have a few options: 

1. full embed - pulls an existing JS Bin directly in to my site (though url can refine which panels are shown)
2. mixed embed - mixes existing content in my site with a predefined JS Bin - enabling me to template code
3. scoop links - allows me to pass through to jsbin, while carrying the code from the site

## Example of full embed

A mini JS Bin embedded in their site via an iframe - since the height is flexible inside JS Bin, the user can style the iframe that's generated.

    <a class="jsbin jsbin-embed" href="http://jsbin.com/abc/edit">Edit this example</a>

Full embed that only includes the JS & Live output

    <a class="jsbin jsbin-embed" href="http://jsbin.com/abc/edit?live,javascript">Edit this example</a>

Mixed embed, that references existing code in my blog and uses the template on the endpoint to run the example:

?? Question - should this try to detect the type of language based on the first few lines, and therefore insert in the best place?

    <a class="jsbin jsbin-mix-embed" rel="#mycode-example1" href="http://jsbin.com/abc/edit">Edit this example</a>

## Scoop links

By clicking on this link, I'll arrive on jsbin.com with existing code from "abc", and the code from `#mycode-example1` inserted into the correct place (possibly detecting which panel to show, too). This is achieved with:

    <a class="jsbin jsbin-scoop" rel="#mycode-example1" href="http://jsbin.com/abc/edit">Edit this example</a>

The JavaScript will transform the link to something like: jsbin.com/abc/edit?live,javascript=[some escaped javascript]

Example usage: on the jQuery UI site, it is much easier if I could add a link that collects the existing code and inserts it into jsbin.com.

## Removing the rel attribute

If we're really smart, we could try searching for the closest `<pre>` element by looking through the parent elements to the given link.
