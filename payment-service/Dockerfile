FROM node:20-alpine
WORKDIR /payment-service
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5004
CMD ["npm","start"]