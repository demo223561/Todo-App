# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# 預設值對應 k8s 環境（Service 名稱與 port），docker compose 環境會用
# environment 變數覆寫成 api / 8000。nginx:alpine 的 entrypoint 會在啟動時
# 自動用 envsubst 把 templates/*.template 轉換成 conf.d/*.conf。
ENV API_HOST=todo-api-service
ENV API_PORT=80

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
