# FDFED-Project/frontend/Dockerfile

# Stage 1: Build the React Application
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This will create a 'dist' folder for Vite apps
RUN npm run build

# Stage 2: Serve the App with Nginx
FROM nginx:alpine
# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
