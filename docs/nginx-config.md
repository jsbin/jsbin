# Running JS Bin behind nginx for SSL support

Here's an example `nginx.conf` file for use when running JS Bin with HTTPS support.

The config also needs to be set:

```json
{
  "url": {
    "host": "jsbin.com",
    "prefix": "/",
    "ssl": true
  }
}
```

And started using something like following:

```
PORT=8000 JSBIN_PROXY=on node app.js
```

The config:

```
#user  nobody;
worker_processes  1;

# error_log  logs/error.log;
# error_log  logs/error.log  notice;
# error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    gzip  on;

    # Redirect port 80 traffic to 443
    server {
        listen         80;
        server_name    jsbin.com, static.jsbin.com, run.jsbin.com;
        rewrite        ^ https://$server_name$request_uri? permanent;
    }

    # HTTPS server
    server {
        listen       443;
        server_name  jsbin.com;
        access_log  /PATH/TO/log/jsbin/jsbin.com.log;

        ssl                  on;
        ssl_certificate      /PATH/TO/CERTIFICATES/jsbin.com.cert;
        ssl_certificate_key  /PATH/TO/CERTIFICATES/jsbin.com.key;

        ssl_session_timeout  5m;

        ssl_protocols  SSLv2 SSLv3 TLSv1;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers   on;

        location / {
            # Pass the request on to Varnish.
            proxy_pass  http://jsbin.com:PORT;

            # Pass a bunch of headers to the downstream server, so they'll know what's going on.
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Accel-Buffering no;
            proxy_set_header Connection '';

            proxy_http_version 1.1;
            proxy_buffering off;
            proxy_cache off;
            chunked_transfer_encoding off;

            # Most web apps can be configured to read this header and understand that the current session is actually HTTPS.
            proxy_set_header X-Forwarded-Proto https;

            # We expect the downsteam servers to redirect to the right hostname, so don't do any rewrites here.
            proxy_redirect     off;
        }
    }

    # Static server
    server {
        listen       443;
        server_name  static.jsbin.com, run.jsbin.com;
        root /PATH/TO/jsbin/public/;
        access_log  /PATH/TO/log/jsbin/static.jsbin.com.log;

        ssl                  on;
        ssl_certificate      /PATH/TO/CERTIFICATES/jsbin.com.cert;
        ssl_certificate_key  /PATH/TO/CERTIFICATES/jsbin.com.key;

        ssl_session_timeout  5m;

        ssl_protocols  SSLv2 SSLv3 TLSv1;
        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers   on;

        location / {
            try_files $uri $uri/ =404;
        }
    }
}
```