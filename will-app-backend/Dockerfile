# Stage 1: Build the TypeScript app
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

ENV DATABASE_URL="postgresql://admin:Welcome@2025@35.185.184.106:5432/hamarawill?schema=public"
ENV RAZORPAY_WEBHOOK_SECRET="VUP6tvw_nbq7tvt9fwg"
ENV RAZOR_PAY_ID=rzp_test_6O84cWnqInEa8T
ENV RAZOR_PAY_SECRET=6mgeEdeNi9fN6qpk2qT13ZgF

RUN npx prisma db pull
RUN npx prisma generate

# Compile TypeScript to JavaScript
RUN npx tsc

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/server.js"]