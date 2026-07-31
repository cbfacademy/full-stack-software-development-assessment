# Runs the Vite development server. Replacing this with a multi-stage
# production build served by Nginx is Stretch Goal A in ASSESSMENT.md.
FROM node:22-alpine
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy configuration and source files
COPY . .

# --host binds to 0.0.0.0 so the port is reachable from outside the container
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
