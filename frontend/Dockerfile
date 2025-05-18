# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./  
RUN npm ci

COPY . .  
RUN npm run build

# Production stage  
FROM nginx:1.25.2-alpine

COPY --from=build /app/build /usr/share/nginx/html

# Remove default nginx config and add custom config if needed  
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
