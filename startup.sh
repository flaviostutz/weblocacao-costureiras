#!/bin/bash

if [ "$WEBLOCACAO_USERNAME" == "" ]; then
    echo "WEBLOCACAO_USERNAME must be defined" 
    exit 1
fi

if [ "$WEBLOCACAO_PASSWORD" == "" ]; then
    echo "WEBLOCACAO_PASSWORD must be defined" 
    exit 1
fi

f="/etc/nginx/conf.d/default.conf"
envsubst < "$f" > "$f"
echo $f
cat "$f"

f="/www/index.html"
envsubst < "$f" > "$f"
echo $f
cat "$f"

echo "Starting nginx on port 80"
nginx -g "daemon off;"
