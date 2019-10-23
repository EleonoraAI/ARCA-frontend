#Docker file image

FROM node:12.8.1

#set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
ADD package.json /usr/src/app/package.json
ADD package.json package-lock.json ./
ADD package.json /app/
ADD . /app

#ADD start.sh /

#ARG sparqlend

RUN npm install npm@6.11.2
#RUN echo "Sparqlendpoint: $sparqlend"

#Bundle app source
COPY . .

ENV SPARQL_ENDPOINT http://localhost:9999/blazegraph/namespace/kb/sparql

#start app
ENTRYPOINT [ "npm", "start"]
