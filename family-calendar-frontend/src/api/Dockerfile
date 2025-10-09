# Wersja Node.js
FROM node:20-alpine

# Katalog roboczy w kontenerze
WORKDIR /src

# Kopiowanie package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiowanie reszty aplikacji
COPY . .

# Port, który będzie expose
EXPOSE 3000

# Uruchomienie aplikacji
CMD ["node", "index.js"]