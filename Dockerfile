FROM node:latest as build
MAINTAINER justinreusnow@gmail.com
WORKDIR /usr/local/app
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine as deploy
WORKDIR /etc/nginx
COPY ./nginx.conf ./nginx.conf
COPY --from=build /usr/local/app/dist/jnet-ui /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
