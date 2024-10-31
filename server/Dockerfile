# Use an official Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the backend server
CMD ["npm", "start"]
