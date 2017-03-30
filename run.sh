#!/bin/bash
npm i
cd client
npm i
rm -rf node_modules/@types/react

npm run build

cd ..
npm run-script prod
