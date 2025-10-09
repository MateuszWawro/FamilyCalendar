# Frontend Dockerfile
FROM node:20-alpine AS build

WORKDIR /app

# Kopiujemy package.json z katalogu nadrzędnego
COPY ../package*.json ./

RUN npm install

# Kopiujemy resztę plików frontendu
COPY . .

RUN npm run build

# Stage produkcyjny z Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]