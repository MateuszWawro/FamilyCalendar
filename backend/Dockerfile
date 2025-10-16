FROM node:20-alpine

WORKDIR /app

# Kopiuj package files
COPY package*.json ./

# Instaluj zależności produkcyjne
RUN npm ci --only=production

# Kopiuj kod źródłowy
COPY . .

# Użytkownik non-root dla bezpieczeństwa
USER node

EXPOSE 3000

CMD ["node", "src/index.js"]