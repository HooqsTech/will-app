# Stage 1: Build the TypeScript app
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

ENV DATABASE_URL="postgresql://postgres:admin@host.docker.internal:5432/will-app?schema=public"

RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]
