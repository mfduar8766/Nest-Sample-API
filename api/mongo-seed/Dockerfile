FROM mongo:latest

COPY initDb.json /initDb.json

COPY index.js /index.js

CMD mongoimport --host mongodb --db travel --collection users --type json --file /initDb.json --jsonArray
