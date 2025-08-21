# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# только пакеты — для лучшего кеширования
COPY package*.json ./
# используем npm install (а не npm ci), т.к. lock-файла может не быть
RUN npm install --only=production

# сам код
COPY server.js ./

EXPOSE 3001
CMD ["node", "server.js"]
