# Etapa 1: build
FROM node:18.16.0-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

# Etapa 2: imagem final, servir estáticos
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

# Ajuste aqui: se o build está em /build, use build; se for dist, use dist
COPY --from=build /app/dist /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
