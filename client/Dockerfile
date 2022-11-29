# install dependencies
FROM node:16-alpine3.16 AS InstallationStage
WORKDIR /user/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm prune --production

# serve
FROM node:16-alpine3.16 AS AppStage
WORKDIR /user/src/app
EXPOSE 3000

COPY --from=InstallationStage /user/src/app ./

CMD [ "npm", "start" ]