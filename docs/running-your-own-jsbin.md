# Running a local copy of JS Bin

JS Bin v3 comes in two flavours: Node and PHP. Though PHP development has now ceased, everything in JS Bin 3.0 (with the exception of code casting and remote rendering) is available.

Installation requires a number of simple steps:

1. Installing code
2. Configuration
3. Database

For the simplest install process we recommend using Node with SQLite. However, if you already have a PHP based environment and want to run JS Bin out of a subdirectory, this is also relatively straight forward to achieve.

## Installing

### Node

You can (and should) install Node directly from `npm` using the following command:

    $ npm install -g jsbin

This will automatically install all the dependancies.

### PHP

Download the source code for JS Bin either by [cloning this project]() or downloading a zip file and decompressing in to a directory (such as `web/public/jsbin`).

## Configuration

JS Bin comes with a default config file. You can either edit this directly, or we recommend copying and modifying your own copy that should be named `config.local.json`:

    cp config.default.json config.local.json

There are a number of options that you can change to configure JS Bin to your needs. The property names, meaning and possible values have been listed below:

* env: `development` or `production`

This is whether you want to run in development mode (recommended) or production. Production mode requires that you build a single JavaScript file for JS Bin to run from. This is only required if you plan to run JS Bin as a service to a larger public audience. Building for production is detailed in a section later on.

* url: Object - detailed next

This is an object controlling how URLs are generated in JS Bin. If you plan to run JS Bin from a subdirectory, you must change these settings.

* url.host: The host you will access JS Bin on, eg. `jsbin.dev` is what we use offline. If you want to include a port number here you should do, eg. `jsbin.dev:8000` will request JS Bin over port 8000.
* url.prefix: `/` or your subdirectory that JS Bin should be accessed from. For instance, if you run JS Bin under `http://remysharp.com/jsbin` the `url.prefix` value must be `/jsbin/`. 
* url.ssl: `false` or `true` whether you want to run JS Bin over SSL.
* url.static: `false` or a url, such as `http://static.jsbin.dev:8000/jsbin/`. This will control where static assets are served from. If the value is `false`, they will be served from the same path as dyanmic content.




## Running from a subdirectory

## Building for production








