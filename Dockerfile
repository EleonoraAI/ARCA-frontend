#Docker file image

FROM node:latest

#set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
ADD package.json /usr/src/app/package.json
ADD package.json package-lock.json ./
#ADD start.sh /

RUN npm install

#Bundle app source
COPY . ./
#ENTRYPOINT ["sh", "/start.sh"]

#start app
CMD [ "npm", "start" ] 
#CMD ["./start.sh"]