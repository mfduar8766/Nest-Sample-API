FROM node:20.10.0-alpine3.18 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

COPY . .

# COPY .env.development.* ./

# RUN npm run build

# EXPOSE 5672

# CMD ["node", "dist/main"]

# CMD ["npm", "run", "start:prod"]
