#Docker file image

FROM node:12.8.1

#set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
ADD . /app

RUN npm i -f
RUN npm install npm@6.11.2

#Bundle app source
COPY . .

ENV SPARQL_ENDPOINT http://blazegraph:9999/blazegraph/namespace/kb/sparql

#start app
ENTRYPOINT [ "npm", "start"]
