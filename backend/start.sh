#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode"
  npx nodemon server.js
else
  echo "Running in production mode"
  npm start
fi
