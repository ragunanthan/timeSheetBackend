FROM node:20.10.0-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
CMD npm start