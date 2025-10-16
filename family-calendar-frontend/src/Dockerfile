# Stage 1: Build
FROM node:20-alpine AS build

# Katalog roboczy
WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy kod frontendu
COPY src/. ./src

# Budujemy frontend (przy założeniu, że "build" w package.json działa w src/)
WORKDIR /app/src
RUN npm run build

# Stage 2: Nginx do serwowania statycznych plików
FROM nginx:alpine
COPY --from=build /app/src/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]