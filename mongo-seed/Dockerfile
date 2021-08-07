FROM mongo:latest

COPY init.json /init.json

CMD mongoimport --host mongodb --db sample --collection users --type json --file /init.json --jsonArray
