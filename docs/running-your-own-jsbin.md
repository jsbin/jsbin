# Run JS Bin locally

JS Bin is a [Node](http://nodejs.org) project.

Install in 3 simple steps:

1. Installing code
2. Configuration
3. Database

For the simplest install process we recommend using Node with SQLite.

Historically, JS Bin v1, v2 and the first release of v3 had support for PHP. **PHP is no longer supported**. If you want to install JS Bin using PHP, I'm afraid you're on your own. There are some old docs that can help, but the project has long surpassed PHP's functionality.  If you want to risk the PHP version, grab [v3.0.0 here](https://github.com/jsbin/jsbin/releases), warts an all.

## Installing

### Node

Install Node first (Node version 0.10.27 will work, no guarantee on later versions) this will give you the `node` and `npm` programs.

You can (and should) install JS Bin with `npm` using the following command:

    $ npm install -g jsbin

This will automatically install all the dependencies.

If you're installing JS Bin for development (and hopefully contribution), clone the project from github:

    $ git clone git@github.com:remy/jsbin.git
    $ cd jsbin
    $ npm install

If you plan to build and test for production, see the section at the end.

## Configuration

JS Bin comes with a default config file. You can either edit this directly, or we recommend copying and modifying your own copy that should be named `config.local.json`:

    cd /usr/local/lib/node-modules/jsbin    # Kubuntu 13.10 example; YMMV
    cp config.default.json config.local.json

There are a number of options that you can change to configure JS Bin to your needs. The property names, meaning and possible values have been listed below:

* env: `development` or `production`

This is whether you want to run in development mode (recommended) or production. Production mode requires that you build a single JavaScript file for JS Bin to run from. This is only required if you plan to run JS Bin as a service to a larger public audience. Building for production is detailed in a section later on.

* url: Object - detailed next

This is an object controlling how URLs are generated in JS Bin. If you plan to run JS Bin from a subdirectory, you must change these settings.

* url.host: The host you will access JS Bin on, eg. `jsbin.dev` is what we use offline. If you want to include a port number here you should do, eg. `jsbin.dev:8000` will request JS Bin over port 8000.
* url.prefix: `/` or your subdirectory that JS Bin should be accessed from. For instance, if you run JS Bin under `http://remysharp.com/jsbin` the `url.prefix` value must be `/jsbin/`.
* url.ssl: `false` or `true` whether you want to run JS Bin over SSL.
* url.static: `false` or a url, such as `http://static.jsbin.dev:8000/jsbin/`. This will control where static assets are served from. If the value is `false`, they will be served from the same path as dynamic content.

### Custom config file location

To start JS Bin with a config file from another location, set the `JSBIN_CONFIG` environment variable as a path to the custom file. The path should be absolute, or relative to your current working directory:

    $ JSBIN_CONFIG=~/config.local.json jsbin

### Running behind a proxy

JS Bin will run behind a proxy, indeed our production version of JS Bin is behind a proxy.

The `PORT` on the command line takes precedence over the config variable. This means in your config, you set the url to be the user facing port (typically port 80, so no port required), and then JS Bin will listen on the port you gave at the environment level.

So to proxy jsbin.com to a localhost:8000 (using something like nginx to do the proxying), the config would look like (this snippet of `config.local.json`):

```json
  "url": {
    "host": "jsbin.com",
    "prefix": "/",
    "ssl": false
  },
```

Note that in the above config, `jsbin.com` is what is used in the HTML and JavaScript, so this is the *client facing url*. Next, running JS Bin behind a proxy is as simple as:

    $ PORT=8000 JSBIN_CONFIG=~/config.local.json jsbin

Now the `jsbin` node process is listening on port 8000, but the client facing urls are all port 80.

### Building for production

JS Bin's build process uses Grunt, so assuming you've cloned a copy, you will need the dev dependancies and the grunt cli:

    $ npm install -g grunt-cli
    $ npm install --dev
    $ grunt build

This will generate the `public/js/prod/` directory and read the version in the `package.json` file to generate to build a number of files:

1. jsbin-<version>.js - the uncompressed, concatenated version of all the scripts from `/scripts.json`
2. jsbin-<version>.min.js - the production compressed version of jsbin, used in the editor
3. jsbin.map.json - the sourcemaps file (useful for debugging in live)
4. runner-<version>.js - the runner script, used to generate the output of the user's code in an iframe
5. runner-<version>.min.js - the production version of the runner

Finally, ensure either the config.local.json's `env` property is set to "production" or you can run JS Bin in production via the environment:

    $ NODE_ENV=production node .

And that's it.


## End-to-end tests
JS Bin has end-to-end tests. The tests can be found in `tests/e2e` folder. 

Running the tests (JS Bin has to be running on port http://localhost:3000): 

    $ npm run e2e