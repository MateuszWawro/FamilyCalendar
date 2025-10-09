# Dockerfile dla backendu

# 1. Oficjalny obraz Node.js
FROM node:20-alpine

# 2. Ustawiamy katalog roboczy w kontenerze
WORKDIR /app

# 3. Kopiujemy tylko pliki package.json i package-lock.json z backendu
COPY src/api/package*.json ./

# 4. Instalujemy zależności
RUN npm install

# 5. Kopiujemy całą resztę backendu
COPY src/api/. .

# 6. Eksponujemy port aplikacji (np. 5000)
EXPOSE 5000

# 7. Uruchamiamy backend
CMD ["npm", "start"]