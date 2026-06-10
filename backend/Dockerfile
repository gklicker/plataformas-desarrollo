FROM node:26.3.0-alpine3.24

WORKDIR /app

# Install dependencies (will be empty for now, but ready for npm install)
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
