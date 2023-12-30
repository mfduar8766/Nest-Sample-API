#!/bin/bash

echo "Do you want to prune all images/containers?: (y/n)"

read ynPrune

if [ $ynPrune = y ]; then
  echo "Running docker-system prune --all ..." &
  docker system prune --all &
else
  echo "Running docker-compose down -v..." &
  docker-compose down -v &
fi

echp "Sleeping for 120 seconds..." &

sleep 120 &

echo "Did you install/update dependencies?: (y/n)"

read yn

if [ $yn = y ]; then
  cd mongo-seed && node index.js &
  cd .. &
  echo "Running docker-compose.yaml and re building all images file and starting services..." &
  COMPOSE_HTTP_TIMEOUT=500 docker-compose up --build -V &
else
  cd mongo-seed && node index.js &
  cd .. &
  echo "Running docker-compose.yaml file and starting services..." &
  COMPOSE_HTTP_TIMEOUT=500 docker-compose up && docker-compose rm -f mongo-seed &
fi
