#!/bin/bash
npm i
cd client
rm -rf node_modules
npm i

npm run build

cd ..
rm -rf node_modules
npm i
npm start