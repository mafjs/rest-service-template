#!/bin/bash

docker run -v `pwd`:/app -t alekzonder/pm2:6.10-slim pm2-docker ./index.js
