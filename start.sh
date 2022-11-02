#!/usr/bin/env bash

# lcp --origin localhost:3001 --port 3001 --proxyUrl finance.yahoo.com/quote/
PORT=3001 npm start & > "logs/npm.log"  
cd backend
node app.js > "../logs/node.log"
