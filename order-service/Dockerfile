FROM node:20-alpine
WORKDIR /order-service
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5002
CMD ["npm","start"]