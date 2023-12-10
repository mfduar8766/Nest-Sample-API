#!/bin/bash

echo "Running docker-compose down -v..." &

docker-compose down -v &

sleep 10 &

echo "Sleeping for 10 seconds..." &

sleep 10 &

echo "Running docker-compose.yaml file and starting services..." &

COMPOSE_HTTP_TIMEOUT=300 docker-compose up &
