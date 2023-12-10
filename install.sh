#!/bin/bash

echo "CD into /services/app-gateway and npm install..." &

cd services/app-gateway &

npm install

echo "CD into /services/app-user and npm install..." &

cd ../app-user

npm install &

cd ../../
