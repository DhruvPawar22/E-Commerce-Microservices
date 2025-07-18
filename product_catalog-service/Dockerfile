FROM node:20-alpine
WORKDIR /product_catalog-service
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm","start"]