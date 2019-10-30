#Docker file image

FROM node:latest

#set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
ADD . /app

RUN npm install

#Bundle app source
COPY . .

ENV SPARQL_ENDPOINT http://blazegraph:8080/blazegraph/namespace/kb/sparql

#start app
ENTRYPOINT [ "npm", "start"]
