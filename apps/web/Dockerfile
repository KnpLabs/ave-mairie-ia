FROM node:20.12.2-alpine as prod

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY ./ .

RUN npm run build

ENV NODE_ENV=production

CMD ["npm", "run", "start"]

######################################################################

FROM prod as dev

ENV NODE_ENV=development

CMD ["npm", "run", "dev"]

