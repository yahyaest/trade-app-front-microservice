# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS builder

# Set the working directory to /install
RUN mkdir /install
WORKDIR /install

# Copy package.json and package-lock.json to the container
COPY package*.json /install/

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the container
COPY . /install/

# Build the React app
ENV NODE_ENV=production
RUN npm run build

# Use a lighter base image for the final stage
FROM node:20-alpine

# Set the working directory to /code
RUN mkdir /code
WORKDIR /code

# Copy build artifacts from the previous stage
# COPY --from=builder /app .
COPY --from=builder /install/package.json /code/
COPY --from=builder /install/package-lock.json /code/
COPY --from=builder /install/next.config.js /code/
# COPY --from=builder /install/public /code/public
COPY --from=builder /install/.next/standalone /code/standalone
COPY --from=builder /install/.next/static /code/standalone/.next/static
COPY --from=builder /install/public /code/standalone/public


# Expose port 3000
EXPOSE 3000

# Start the app
# CMD ["npm", "start"]
# CMD [ "node", "/code/standalone/server.js" ]
CMD ["sh", "-c", "tail -f /dev/null"]
