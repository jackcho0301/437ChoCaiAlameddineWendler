#!/usr/bin/env bash

PORT=3001 npm start & > "logs/npm.log"  
cd backend
node app.js > "../logs/node.log"
