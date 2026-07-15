# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package.json
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
ENV NODE_ENV=production
RUN npm run rsbuild:build

# Stage 2: Production Server (Nginx)
FROM nginx:alpine
# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx.conf for SPA routing
RUN echo -e 'server {\n\
    listen 80;\n\
    location ~* ^/(index\.html)$ {\n\
        root /usr/share/nginx/html;\n\
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";\n\
    }\n\
    location / {\n\
        root /usr/share/nginx/html;\n\
        index index.html index.htm;\n\
        try_files $uri $uri/ /index.html;\n\
        add_header Access-Control-Allow-Origin *;\n\
    }\n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
