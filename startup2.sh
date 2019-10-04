#!/bin/bash

envsubst < /www/_www/deadlines/deadlines.js > /tmp/deadlines2.js
cp /tmp/deadlines2.js /www/_www/deadlines/deadlines.js

/startup.sh
