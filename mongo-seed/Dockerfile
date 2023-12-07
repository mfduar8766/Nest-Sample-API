FROM mongo:latest

COPY initDb.json /initDb.json

COPY index.js /index.js

# COPY createDB.sh /

# RUN chmod +x /createDB.sh

# ENTRYPOINT ["/createDB.sh"]

# CMD [ "node", "index.js"]

CMD mongoimport --host mongodb --db sample --collection users --type json --file /initDb.json --jsonArray