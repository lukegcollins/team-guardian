# Use the official Node.js 18.x image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the source code to the working directory
COPY ./src ./src

# Expose the port on which your service listens
EXPOSE 1002

# Set the command to start your application
CMD [ "npm", "start" ]