# About

This is a microService repo for the purpose of learning how to properly create microServices with NESTjs along with docker. This repo might have a front end as well in the future. The repo consists of 2 services app-gateway (REST API) service and app-user (TCP Service).

# Folder Structure

- Root
  - api
    - mongo-seed: Used to pre populate mongoDB docker image with user data for testing
    - app-user: Used to communicate with mongoDB to query for user info and send to app-gateway
    - app-gateway: Used as REST API that comminicates with all other services
    - common: Used as a shared folder for models and types
    - docker-compose.yaml
  - start.sh: Runs docker-compose.yaml and starts services
  - install.sh: Cds into services and runs npm install
  - gitAddCommitPush.sh: Used to git add --all:/. and git commit and git push origin <branch>

# Pre Requisites

1. Install LTS version of NodeJS currently 20.10.0: https://nodejs.org/en you should use NVM to install node to make it easier to switch between versions of NODE.

2. Install NEST-CLI: https://docs.nestjs.com/cli/overview

3. Install Docker Desktop for your OS: https://www.docker.com/products/docker-desktop/

4. Once installed test to see if docker deamon is running by running the command:

- `docker ps`

5. Create a .env.development.local in api folder and add the following content:

- `cd api && touch .env.development.local`

### ENV:

NODE_ENV=development <br/>
API_VERSION=v1 <br/>
PORT=3000 <br/>
HOST=localhost <br/>
USER_SERVICE_HOST="app-users" <br/>
USER_SERVICE_PORT=8080 <br/>
DB_COLLECTION=users <br/>
DB_NAME=sample <br/>
ROLES="USER, ADMIN, SUPER_USER" <br/>
REDIS_HOST=localhost <br/>
REDIS_PORT=6379 <br/>
DB_PORT=27017 <br/>
MONGODB_URL=mongodb://mongodb:27017/sample <br/>
TIMEOUT=5000 <br/>

6. Install MongoDB Compass or any other mongoDB GUI: https://www.mongodb.com/products/tools/compass

7. Run `chmod +x ./start.sh && chmod +x ./install.sh && chmod +x ./gitAddCommitPush.sh` to make scripts executable

8. Run `./install.sh` to install dependencies for app-user and app-gateway

9. Run `./start.sh` to build the docker containers. This takes a while depending on your system. By default the start.sh script will run docker in attached mode so you will be able to see logs in console.

# Making Requests

Once services are running you can make a GET request to: `localhost:3000/api/v1/users`
The operations the API support are:

- GET: localhost:3000/api/v1/users
- GET_BY_ID: localhost:3000/api/v1/users/id
  - Request Params: userID
- POST: localhost:3000/api/v1/users
  - Request Headers:
    - `roles: ['ADMIN', 'SUPER_USER']`
    - `isBulkInsert: boolean`
  - Request Body:
    - List of users for bulk insert or a single user object to insert into Db
- PUT: localhost:3000/api/v1/users/id
  - Request Params: userID
- DELETE: localhost:3000/api/v1/users/id
  - Request Params: userID
  - Request Headers:
    - `bulk-delete: boolean`
    - `id-list: list of userIDs to delete`
