#Docker file image

FROM node:latest

#set working directory
WORKDIR /app

#install and cache app dependencies
COPY package*.json ./
ADD package.json /usr/src/app/package.json
ADD package.json package-lock.json ./
ADD start.sh /

RUN npm install

#Bundle app source
COPY . ./

#start app
<<<<<<< HEAD
CMD ["/start.sh"]
=======
CMD ["npm", "start"]

#build image = "docker build -t arca ."
#run image = "docker run -it -p 5000:5000 arca"
>>>>>>> parent of 2c4a5b9... Update Dockerfile
