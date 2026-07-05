# Start your image with a node base image
# Use LTS (Long-Term Support) node version - 22.14.0
FROM node:22.14.0

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package manifest and yarn lockfile
COPY package.json yarn.lock ./

# Install node packages using yarn
RUN yarn install --production --frozen-lockfile

# Copy local directories to the current local directory of our docker image (/app)
COPY ./src ./src
COPY ./public ./public

EXPOSE 8080

# Start the app using serve command
CMD [ "yarn", "start" ]