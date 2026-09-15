# Todo App

**技術架構：**
- 前端：React + nginx
- 後端：FastAPI
- 資料庫：MySQL 8.0


## 目錄結構

```
todo-app/
├── backend/          # FastAPI 後端
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── database.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/         # React 前端
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── nginx.conf.template
├── docker-compose.prod.yaml
└── .env.example
```


## 快速開始

### Clone 下來 部署到自己的 Docker Hub，步驟如下 :

1. **Clone 專案**

   ```bash
   git clone https://github.com/demo223561/Todo-App.git
   cd Todo-App
   ```

2. **登入 Docker Hub**

   ```bash
   docker login
   ```

3. **（建議）建立支援多架構（amd64 / arm64）的 builder**

   ```bash
   docker buildx create --use
   ```

4. **Build 並推送 backend image**

   將 `<你的Docker Hub帳號>` 換成你自己的帳號名稱：

   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
     -t <你的Docker Hub帳號>/todo-app-api:v1.0.0 \
     --push ./backend
   ```

5. **Build 並推送 frontend image**

   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
     -t <你的Docker Hub帳號>/todo-frontend:v1.0.0 \
     --push ./frontend
   ```

6. **修改 `docker-compose.prod.yaml`**

   把 `image:` 欄位改成你剛剛推上去的 image 名稱：

   ```yaml
   services:
     frontend:
       image: <你的Docker Hub帳號>/todo-frontend:v1.0.0
     api:
       image: <你的Docker Hub帳號>/todo-app-api:v1.0.0
   ```

7. **複製環境變數檔**

   ```bash
   cp .env.example .env
   ```

8. **啟動並測試自己推的 image**

   ```bash
   docker compose -f docker-compose.prod.yaml up -d
   ```
   - 前端：http://localhost:3000
   - 後端 API 文件：http://localhost:8000/docs

   > **說明**：frontend 的 `nginx.conf.template` 用環境變數 `API_HOST` / `API_PORT`
   > 決定要把 `/api/` 轉發到哪個後端主機，讓同一份 image 能同時支援 docker compose
   > 和 K8s 兩種環境：
   > - docker compose：`docker-compose.prod.yaml` 已設定 `API_HOST=api`、`API_PORT=8000`，
   >   對應 compose 裡 `api` 服務的名稱與監聽 port，前端頁面可以直接正常串接 API。
   > - K8s：image 內建預設值 `API_HOST=todo-api-service`、`API_PORT=80`，
   >   對應之後 K8s 章節要建立的 Service，不需額外設定即可運作；若 Service
   >   名稱不同，於 Deployment 中覆寫這兩個環境變數即可。

