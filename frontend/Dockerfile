# --- Stage 1: Build stage ---
FROM node:22-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy configuration and source files
COPY . .
RUN npm run build

# --- Stage 2: Production server stage ---
FROM nginx:alpine

# Copy built static assets from the build stage to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a basic Nginx configuration to handle React Router client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]