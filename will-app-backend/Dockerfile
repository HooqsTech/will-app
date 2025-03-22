# Stage 1: Build the TypeScript app
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

RUN npx prisma db pull
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]
