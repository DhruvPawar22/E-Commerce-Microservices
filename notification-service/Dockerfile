FROM node:20-alpine
WORKDIR /notification-service
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5005
CMD ["npm","start"]