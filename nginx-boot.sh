#!/bin/sh

export NGINX_CONF=/etc/nginx/mushed.conf

export GZIP_TYPES=${GZIP_TYPES:-application/javascript application/x-javascript application/rss+xml text/javascript text/css image/svg+xml}
export GZIP_LEVEL=${GZIP_LEVEL:-6}
export INDEX_FILE=/usr/share/nginx/html/index.html

# cat $INDEX_FILE | sed 's/_TEMPLATE//g' | envsubst > /tmp/index.html
# mv /tmp/index.html $INDEX_FILE

cat <<EOF > $NGINX_CONF

daemon              off;
worker_processes    1;
user                root;

events {
  worker_connections 1024;
}

http {
  include       mime.types;
  default_type  application/octet-stream;
  keepalive_timeout  15;
  autoindex          off;
  server_tokens      off;
  port_in_redirect   off;
  absolute_redirect  off;
  sendfile           off;
  tcp_nopush         on;
  tcp_nodelay        on;
  client_max_body_size 64k;
  client_header_buffer_size 16k;
  large_client_header_buffers 4 16k;

  ## Gzipping is an easy way to reduce page weight
  gzip                on;
  gzip_vary           on;
  gzip_proxied        any;
  gzip_types          $GZIP_TYPES;
  gzip_buffers        16 8k;
  gzip_comp_level     $GZIP_LEVEL;
  access_log         /dev/stdout;
  error_log          /dev/stderr error;

  server {
    listen ${PORT:-80};
    root /usr/share/nginx/html;
    index index.html;
    autoindex off;
    charset utf-8;
    error_page 404 /404.html;

    location / {
      try_files \$uri /index.html =404;
    }

    location ~* \.(ico|jpg|jpeg|png|gif|svg|js|jsx|css|less|swf|eot|ttf|otf|woff|woff2)$ {
      add_header Cache-Control "public";
      expires +1y;
    }
  }
}

EOF

exec nginx -c $NGINX_CONF
