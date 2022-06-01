FROM node:16

WORKDIR /app

COPY package*.json ./

COPY . .

RUN rm -rf node_modules
RUN npm ci --only=production

EXPOSE 4000
CMD [ "node", "index.js" ]