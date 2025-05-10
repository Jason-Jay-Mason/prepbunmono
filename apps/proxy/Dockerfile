FROM nginx:alpine

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d /etc/nginx/conf.d

# Expose ports
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
