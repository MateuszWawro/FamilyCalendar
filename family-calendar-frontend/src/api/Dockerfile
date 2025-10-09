# Backend Dockerfile
FROM node:20-alpine

WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików backendu
COPY . .

EXPOSE 3000
CMD ["npm", "start"]