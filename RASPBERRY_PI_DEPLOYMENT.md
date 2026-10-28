# Raspberry Pi Deployment Architecture & Configuration

This guide provides the exact deployment specification from the active Raspberry Pi setup (`192.168.86.68`) running the other Dockerized microservices.

---

## 1. Pi Server Architecture

- **Host IP**: `192.168.86.68`
- **Docker Compose Directory**: `/opt/pi-server/`
- **Apps Directory**: `/opt/pi-server/apps/`
  - Current apps installed:
    - `/opt/pi-server/apps/stocks` (Autonomous E*TRADE Paper Trading Agent)
    - `/opt/pi-server/apps/graham-tracker` (PWA)
    - `/opt/pi-server/apps/coffee-assistant` (Hardware-enabled PWA)
- **Shared Docker Network**: `proxy_net`
- **Nginx Proxy Manager**: Running on ports `80`, `443`, and `81` (Admin UI).

### Port Map Reference:
| Service | Container Name | Host Port | Internal Port | Network |
| :--- | :--- | :--- | :--- | :--- |
| **Nginx Proxy Manager** | `pi-proxy-manager` | `80`, `443`, `81` | `80`, `443`, `81` | `proxy_net` |
| **Graham Tracker** | `pi-graham-tracker` | `3000` | `3000` | `proxy_net` |
| **Coffee Assistant** | `pi-coffee-assistant`| `5000` | `5000` | `host` |
| **Stocks Trading Agent** | `pi-stocks-agent` | `8001` | `8000` | `proxy_net` |
| **Napa Wine Tour (Proposed)** | `pi-wine-tour` | `5173` (or `3001`) | `5173` | `proxy_net` |

---

## 2. Docker Setup for Napa Valley Wine Presentation

### Option A: Integrate into `/opt/pi-server/docker-compose.yml`

On the Raspberry Pi, add the `wine` service block to `/opt/pi-server/docker-compose.yml`:

```yaml
  # App 4: Napa Valley Wine Tasting Interactive Presentation
  wine:
    build:
      context: ./apps/wine
      dockerfile: Dockerfile
    container_name: pi-wine-tour
    restart: unless-stopped
    ports:
      - '5173:5173'
    networks:
      - proxy_net
```

### Option B: Recommended Production Dockerfile for Wine Tour

In `/opt/pi-server/apps/wine/Dockerfile` (or repo root):

```dockerfile
# Multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev ws express
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/server ./server

ENV PORT=5173
EXPOSE 5173

# Run production static server with WebSocket sync relay
CMD ["node", "server/prodServer.js"]
```

---

## 3. Deployment Commands on the Raspberry Pi

```bash
# 1. Clone repository into the Pi apps folder
cd /opt/pi-server/apps
git clone <wine-repo-url> wine

# 2. Rebuild and launch the container
cd /opt/pi-server
sudo docker compose build --no-cache wine && sudo docker compose up -d wine
```

---

## 4. Operational Notes
- **Hosting vs Rendering**: The Raspberry Pi handles static file serving and the WebSocket synchronization server (`/sync-ws`).
- **Clients**: Client devices (Mac/PC connected to TV, iPhones, iPads) load the page in their own browsers and render the MapLibre 3D WebGL terrain using their local GPUs.
