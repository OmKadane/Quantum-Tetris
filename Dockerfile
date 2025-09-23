# Use a lightweight Nginx web server as the base image
FROM nginx:1.25.2-alpine

# Set the main directory inside the container where the web server looks for files
WORKDIR /usr/share/nginx/html

# Copy everything from your project (index.html, script.js, assets, sounds, etc.) 
# into the web server's directory inside the container.
COPY . .