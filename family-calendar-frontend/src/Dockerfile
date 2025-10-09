# Dockerfile dla frontendu

# 1. Wybieramy oficjalny obraz Node.js
FROM node:20-alpine AS build

# 2. Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# 3. Kopiujemy tylko pliki package.json i package-lock.json z frontendu
COPY src/package*.json ./

# 4. Instalujemy zależności
RUN npm install

# 5. Kopiujemy całą resztę frontendu
COPY src/. .

# 6. Budujemy front-end
RUN npm run build

# 7. Serwujemy aplikację np. przez nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# 8. Domyślny port nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]