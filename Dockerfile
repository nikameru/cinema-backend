FROM node:20

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

CMD [ "node", "dist/index" ]
