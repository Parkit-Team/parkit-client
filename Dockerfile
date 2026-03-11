# Stage 1: Serve the React application using Nginx
FROM nginx:stable-alpine

# Remove default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the build output (dist folder) from Jenkins workspace to Nginx html directory
COPY dist /usr/share/nginx/html

# Add custom Nginx configuration to support SPA routing (handling 404 errors)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]