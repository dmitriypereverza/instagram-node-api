FROM node:10.12.0-alpine

# add bash
RUN apk update
RUN apk upgrade
RUN apk add bash

WORKDIR /app
COPY . /app
RUN npm install
COPY ./docker/wait-for-it.sh /usr/local
RUN chmod +x /usr/local/wait-for-it.sh

EXPOSE 3000

CMD ["npm", "start"]
