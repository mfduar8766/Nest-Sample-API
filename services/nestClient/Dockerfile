FROM node:20.10.0-alpine3.18 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install --only=development

COPY . .

# Copy the .env and .env.development files
COPY .env.development.* ./

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/main"]

# CMD ["npm", "run", "start:prod"]
