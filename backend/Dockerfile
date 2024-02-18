# Use the official Node.js image based on Alpine Linux as the base image. Alpine is chosen for its small size and security.
FROM node:alpine

# Set the working directory inside the Docker container. Future commands will operate in this directory.
WORKDIR /usr/src/app

# Set an environment variable within the Docker image. Here, we specify that our application is running in production mode.
ENV NODE_ENV=production

# Copy the package.json and package-lock.json (if available) files to the Docker image. This is done before copying the entire project to leverage Docker's cache, speeding up rebuilds when dependencies haven't changed.
COPY package*.json ./

# Run npm install in the Docker image to install the dependencies specified in package.json.
RUN npm install

# Copy the rest of your project's files into the Docker image.
COPY . .

# Inform Docker that the container listens on port 5000 at runtime. This does not actually publish the port; it functions as documentation and can be overridden by docker run or docker-compose.
EXPOSE 5000

# Use ENTRYPOINT to specify the command that should be executed when the Docker container starts. Here, it runs your Node.js application using node. The ENTRYPOINT form used (JSON array) ensures that the command is executed without a shell, which is the preferred method for CMD and ENTRYPOINT instructions.
ENTRYPOINT ["node", "src/index.js"]
