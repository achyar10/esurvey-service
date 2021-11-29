FROM node:14.17-alpine As development

LABEL maintainer="Achyar Anshorie <achyar@matik.id>"

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build && rm -rf node_modules

FROM node:14.17-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

WORKDIR /usr/src/app

COPY --chown=nestjs:nodejs package.json ./

RUN npm install --only=production

COPY --chown=nestjs:nodejs . .

COPY --from=development --chown=nestjs:nodejs /usr/src/app/dist ./dist

USER nestjs

EXPOSE 7002

CMD ["node", "dist/main"]