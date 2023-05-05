# Use the official Node.js 14 image as the base image
FROM node:14

# Create a directory for our app inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app code to the container
COPY . .

# Build the app
RUN npm run build

# Expose port 3000 to the host
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
