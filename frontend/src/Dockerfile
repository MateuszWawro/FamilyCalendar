# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Kopiujemy package.json i package-lock.json
COPY package*.json ./

# Instalujemy zależności
RUN npm install

# Kopiujemy cały frontend (index.html i src/)
COPY . .

# Budujemy frontend (vite tworzy dist w WORKDIR, czyli /app)
RUN npm run build

# Stage 2: Nginx do serwowania statycznych plików
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]