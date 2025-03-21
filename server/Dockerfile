# Start your image with a node base image
# Use LTS (Long-Term Support) node version - 22.14.0
FROM node:22.14.0

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./src ./src

# Install node packages using yarn
RUN yarn install --production

EXPOSE 8080

# Start the app using serve command
CMD [ "yarn", "start" ]