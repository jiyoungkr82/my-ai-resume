FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# package.json의 scripts에 "start"가 있는지 확인하세요
CMD ["npm", "run", "start"]
