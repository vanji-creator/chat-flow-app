FROM node:18-alpine

# Install Nmap
RUN apk add --no-cache nmap

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3001

# Start server
CMD ["npx", "ts-node", "index.ts"]
