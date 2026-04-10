# FDFED-Project/backend/Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose the port your backend runs on (assuming 5000 or 3000, adjust if different)
EXPOSE 5500

# Start the application
CMD ["npm", "start"]
