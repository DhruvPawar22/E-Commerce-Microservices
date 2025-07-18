FROM node:20-alpine
WORKDIR /cart-service
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5003
CMD ["npm","start"]