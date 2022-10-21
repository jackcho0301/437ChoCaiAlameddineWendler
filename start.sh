#!/usr/bin/env bash

cd backend
node app.js > "../logs/node.log" #use & to execute synchronously w/ frontend
cd ..
PORT=3001 npm start > "logs/npm.log"  
