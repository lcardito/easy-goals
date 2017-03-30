#!/bin/bash
npm i
cd client
npm i

rm -rf node_modules/@types/react

cd ..
npm start
