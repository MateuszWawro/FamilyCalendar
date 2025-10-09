# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy resztę plików frontendu
COPY . .

# Budujemy aplikację
RUN npm run build

# Stage produkcyjny z Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]