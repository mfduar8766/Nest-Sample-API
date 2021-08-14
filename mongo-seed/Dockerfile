FROM mongo:latest

COPY initDb.json /initDb.json

CMD mongoimport --host mongodb --db sample --collection users --type json --file /initDb.json --jsonArray
