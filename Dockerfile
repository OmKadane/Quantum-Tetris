# Stage 1: Linter and Builder Stage
# This stage checks the code quality
FROM node:18-alpine as linter
WORKDIR /app
COPY package*.json ./
COPY eslint.config.mjs ./
COPY script.js ./
RUN npm install
# This command will fail the build if there are any linting errors
RUN npm exec eslint . 

# Stage 2: Production Stage
# This stage builds the final, lightweight image
FROM nginx:1.25-alpine

# Copy the game files from the current directory to the Nginx web server directory
COPY index.html /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
COPY script.js /usr/share/nginx/html
COPY assets/ /usr/share/nginx/html/assets
COPY sounds/ /usr/share/nginx/html/sounds

# Expose port 80 to the outside world
EXPOSE 80

# Command to start the Nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]