#This Dockerfile demonstrates a multi-stage build, which is a method to create lean and secure Docker images by 
#separating the build environment (where dependencies are installed and the application is built) from the 
#production environment (where the application is served).

# Build stage: This stage is named 'build-stage' and uses the node:alpine image as its base. The Node image is chosen for its small size and because it provides the necessary environment to install dependencies and build the application.
FROM node:alpine as build-stage

# Sets the working directory inside the container to /app. Future commands will run in this directory.
WORKDIR /app

# Copies the package.json and package-lock.json files into the working directory. These files define the project's dependencies.
COPY package*.json ./

# Runs npm install to install the project dependencies defined in package.json.
RUN npm install

# Copies the rest of the project files into the container.
COPY . .

# Runs the build script defined in package.json. This typically compiles the application into static files for production.
RUN npm run build

# Production stage: This stage starts a new build phase with nginx:stable-alpine as the base image. Nginx is chosen for serving the static files because it's lightweight and efficient.
FROM nginx:stable-alpine as production-stage

# Copies the static files from the /app/build directory in the build-stage to the Nginx serve directory. The --from=build-stage specifies that it should copy the files from the build-stage.
COPY --from=build-stage /app/build /usr/share/nginx/html

# Exposes port 80 to the host machine. Nginx listens on port 80 by default for incoming connections.
EXPOSE 80

# Specifies the command to run Nginx in the foreground. This is necessary because Docker containers stop when their main process ends, and running Nginx in the background would cause the container to stop.
CMD ["nginx", "-g", "daemon off;"]
