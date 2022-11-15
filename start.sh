#!/usr/bin/env bash

# Stdout goes to logs, stderr still printed
bash proxy.sh > './logs/proxy.log' &
PORT=3001 npm start > "./logs/npm.log" & 
cd backend
node app.js > "../logs/node.log"
