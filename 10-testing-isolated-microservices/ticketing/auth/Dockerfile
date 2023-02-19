FROM node:alpine

WORKDIR /app
COPY package.json .
# RUN npm install --only=prod
RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]