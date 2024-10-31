# Use an official Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React app
RUN npm run build

# Expose the frontend port
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]
