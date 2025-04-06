# Use Node.js to build the frontend
FROM node:22.13.1-alpine  

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Set environment variable
ENV VITE_API_URL=https://backend-170230222445.asia-south2.run.app

# Install dependencies & build the project
RUN npm install && npm run build

# Install Nginx (since we're using a single stage)
RUN apk add --no-cache nginx

# Ensure the directory exists
RUN mkdir -p /usr/share/nginx/html  

# Copy built files to Nginx's serving directory
RUN cp -r dist/* /usr/share/nginx/html/

# Copy custom nginx configuration
COPY src/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
