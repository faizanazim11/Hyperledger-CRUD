FROM node:16 as app-build
WORKDIR /app

COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=app-build /app/dist/angular-api/ /usr/share/nginx/html
EXPOSE 80
