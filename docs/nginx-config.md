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
worker_processes auto;

error_log  /var/log/nginx/nginx_error.log;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    server_tokens off;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;

    keepalive_timeout  20;

    gzip                on;
    gzip_http_version   1.0;
    gzip_comp_level     5;
    gzip_min_length     256;
    gzip_disable        msie6;
    gzip_proxied        any;
    gzip_vary           on;
    gzip_types
        application/atom+xml
        application/javascript
        application/json
        application/rss+xml
        application/vnd.ms-fontobject
        application/x-font-ttf
        application/x-web-app-manifest+json
        application/xhtml+xml
        application/xml
        font/opentype
        image/svg+xml
        image/x-icon
        text/css
        text/plain
        text/x-component;

    # Redirect port 80 traffic to 443
    server {
        listen  80;
        return  301 https://$host$request_uri;
    }

    # Static server
    server {
        listen       443;
        server_name  static.jsbin.com run.jsbin.com;
        root         /PATH/TO/jsbin/public/;
        index        index.html;
        access_log   /PATH/TO/log/jsbin/static.jsbin.com.log;

        ssl                  on;
        ssl_certificate      /PATH/TO/CERTS/localhost.cert;
        ssl_certificate_key  /PATH/TO/CERTS/localhost.key;

        ssl_session_timeout  5m;

        ssl_protocols               SSLv2 SSLv3 TLSv1;
        ssl_ciphers                 HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers   on;

        # Expire rules for static content

        # Runner
        location ~* /runner {
            expires -1;
            add_header X-Test no-cache;
        }

        # cache.appcache, your document html and data
        location ~* \.(?:manifest|appcache|html?|xml|json)$ {
            expires -1;
        }

        # Media: images, icons, video, audio, HTC
        location ~* \.(?:jpg|jpeg|gif|png|ico|gz|svg|svgz|mp4|ogg|ogv|webm|htc)$ {
            expires 1M;
            access_log off;
            add_header Cache-Control "public";
        }

        # CSS and Javascript
        location ~* \.(?:css|js)$ {
            expires 1y;
            access_log off;
            add_header Cache-Control "public";
        }

        # WebFonts
        location ~* \.(?:ttf|ttc|otf|eot|woff|font.css)$ {
            expires 1M;
            access_log off;
            add_header Cache-Control "public";
        }

        location / {
            try_files   $uri $uri/ =404;
            add_header  Pragma "public";
            add_header  Cache-Control "public, must-revalidate, proxy-revalidate";
            add_header  Last-Modified $sent_http_Expires;
            add_header  Access-Control-Allow-Origin *;
        }
    }

    # HTTPS server
    server {
        listen      443;
        server_name jsbin.com;
        access_log  /PATH/TO/log/jsbin/jsbin.com.log;

        ssl                  on;
        ssl_certificate      /PATH/TO/CERTS/localhost.cert;
        ssl_certificate_key  /PATH/TO/CERTS/localhost.key;

        ssl_session_timeout  5m;

        ssl_protocols               SSLv2 SSLv3 TLSv1;
        ssl_ciphers                 HIGH:!aNULL:!MD5;
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

            proxy_http_version          1.1;
            proxy_buffering             off;
            proxy_cache                 off;

            # Most web apps can be configured to read this header and understand that the current session is actually HTTPS.
            proxy_set_header X-Forwarded-Proto https;

            # We expect the downsteam servers to redirect to the right hostname, so don't do any rewrites here.
            proxy_redirect     off;
        }
    }
}
```