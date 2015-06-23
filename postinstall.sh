#bin/bash

cd client
echo "npm install -> client"
npm install
echo "grunt deploy -> client"
grunt deploy

cd ../server
echo "npm install -> server"
npm install