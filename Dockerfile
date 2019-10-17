#Docker file image

FROM node:latest

#set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
ADD package.json /usr/src/app/package.json
ADD package.json package-lock.json ./

RUN npm install
RUN SPARQL_ENDPOINT=http://localhost:9999/blazegraph/namespace/ARCA_triple_store/sparql

#Bundle app source
COPY . ./

#start app
CMD ["npm", "start"]

#build image = "docker build -t arca ."
#run image = "docker run -it -p 5000:5000 arca"
