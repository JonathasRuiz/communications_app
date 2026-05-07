# Runtime Configuration Guide

This guide explains how to configure the communications-app at runtime using environment variables. This is useful when deploying with Docker or Kubernetes where each deployment has different host/port configurations.

## Overview

Traditionally, React apps require environment variables to be set at build time (`npm run build`). This creates a problem when you want to deploy the same Docker image to different environments with different configurations.

**Solution**: This app uses a runtime configuration system that allows you to set environment variables at container startup time, not build time.

## How It Works

1. **Template File**: `public/env-config.js.template` contains placeholders for environment variables
2. **Entrypoint Script**: `communications_app_image/start-nginx` processes the template using `envsubst`
3. **Runtime Config**: Generates `env-config.js` with actual values at container startup
4. **React App**: Reads from `window._env_` object via `src/utils/env.ts`

## Available Environment Variables

### Server Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_SERVER_URL` | Main server hostname/IP | `localhost` |
| `REACT_APP_SERVER_PORT` | Main server port | `8080` |

### WebSocket Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_WS_CLIENT_HOST` | WebSocket client hostname | `localhost` |
| `REACT_APP_WS_CLIENT_PORT` | WebSocket client port | `8080` |
| `REACT_APP_WS_SERVER_HOST` | WebSocket server hostname | `localhost` |
| `REACT_APP_WS_SERVER_PORT` | WebSocket server port | `8080` |

### Tracker Service Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_TRACKER_PORT` | Tracker service port | `8080` |
| `REACT_APP_TRACKER_CLIENT` | Tracker client port | `3001` |
| `REACT_APP_TRACKER_SERVER_GO_PORT` | Tracker Server Go port | `8080` |
| `REACT_APP_TRACKER_CLIENT_GO_PORT` | Tracker Client Go port | `8081` |
| `REACT_APP_TRACKER_ANALYTICS_PORT` | Tracker Analytics port | `5050` |

### MQTT Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_MQTT_WS_URL` | MQTT WebSocket URL | `ws://localhost:9001/mqtt` |

### Google Maps Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_GOOGLE_MAPS_API_KEY` | Google Maps API Key | (empty) |

⚠️ **IMPORTANT SECURITY NOTE**: The Google Maps API Key will be visible in the browser (client-side). You **MUST** restrict this key in Google Cloud Console:
1. Go to [Google Cloud Console > APIs & Services > Credentials](https://console.cloud.google.com/apis/credentials)
2. Select your API key
3. Under **"Application restrictions"**, select **"HTTP referrers (websites)"**
4. Add your domain(s): e.g., `https://yourdomain.com/*`, `https://*.yourdomain.com/*`
5. Under **"API restrictions"**, select **"Maps JavaScript API"** only
6. Save changes

This prevents unauthorized use of your key on other websites. Without these restrictions, someone could steal and use your API key, running up your bill.

## Usage Examples

### Docker Run

```bash
docker run -p 3000:80 \
  -e REACT_APP_SERVER_URL=tracker-server-service \
  -e REACT_APP_SERVER_PORT=8080 \
  -e REACT_APP_WS_SERVER_HOST=tracker-server-service \
  -e REACT_APP_WS_SERVER_PORT=8080 \
  -e REACT_APP_GOOGLE_MAPS_API_KEY=your_restricted_api_key_here \
  communications-app:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  communications-app:
    image: communications-app:latest
    ports:
      - "3000:80"
    environment:
      REACT_APP_SERVER_URL: tracker-server-service
      REACT_APP_SERVER_PORT: "8080"
      REACT_APP_WS_SERVER_HOST: tracker-server-service
      REACT_APP_WS_SERVER_PORT: "8080"
      REACT_APP_TRACKER_ANALYTICS_PORT: "5050"
      REACT_APP_GOOGLE_MAPS_API_KEY: "${GOOGLE_MAPS_API_KEY}"
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: communications-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: communications-app
  template:
    metadata:
      labels:
        app: communications-app
    spec:
      containers:
      - name: communications-app
        image: communications-app:latest
        ports:
        - containerPort: 80
        env:
        - name: REACT_APP_SERVER_URL
          value: "tracker-server-service"
        - name: REACT_APP_SERVER_PORT
          value: "8080"
        - name: REACT_APP_WS_SERVER_HOST
          value: "tracker-server-service"
        - name: REACT_APP_WS_SERVER_PORT
          value: "8080"
        - name: REACT_APP_TRACKER_ANALYTICS_PORT
          value: "5050"
        - name: REACT_APP_GOOGLE_MAPS_API_KEY
          valueFrom:
            secretKeyRef:
              name: google-maps-secret
              key: api-key
---
apiVersion: v1
kind: Service
metadata:
  name: communications-app
spec:
  selector:
    app: communications-app
  ports:
  - port: 80
    targetPort: 80
```

### Terraform (with Kubernetes Provider)

```hcl
resource "kubernetes_deployment" "communications_app" {
  metadata {
    name = "communications-app"
  }
  
  spec {
    replicas = 1
    
    selector {
      match_labels = {
        app = "communications-app"
      }
    }
    
    template {
      metadata {
        labels = {
          app = "communications-app"
        }
      }
      
      spec {
        container {
          name  = "communications-app"
          image = "communications-app:latest"
          
          port {
            container_port = 80
          }
          
          env {
            name  = "REACT_APP_SERVER_URL"
            value = kubernetes_service.tracker_server.metadata[0].name
          }
          
          env {
            name  = "REACT_APP_SERVER_PORT"
            value = "8080"
          }
          
          env {
            name  = "REACT_APP_TRACKER_ANALYTICS_PORT"
            value = "5050"
          }
        }
      }
    }
  }
}
```

## Development vs Production

### Development (Local)

When running locally with `npm start`:
- Environment variables are read from `.env` file at build time
- Changes require restarting the dev server
- Uses `process.env` (traditional React behavior)

### Production (Docker)

When running in Docker:
- Environment variables are processed at container startup
- No rebuild required when changing configuration
- Uses `window._env_` (runtime configuration)

## Troubleshooting

### Check Runtime Configuration

Open browser DevTools and check:
```javascript
console.log(window._env_);
```

This should show all configured environment variables.

### View Container Logs

```bash
# Docker
docker logs <container-id>

# Kubernetes
kubectl logs -l app=communications-app
```

Look for messages like:
- "Generating runtime environment configuration..."
- "[Runtime Config] Server Host: tracker-server:8080"

### Verify Template Processing

SSH into running container:
```bash
docker exec -it <container-id> sh
cat /var/www/app.wisecodedev.com/env-config.js
```

You should see actual values, not `${PLACEHOLDER}` syntax.

## Migration from Build-Time Config

If you previously used build-time environment variables:

1. **Before**: Set `REACT_APP_*` vars before `npm run build`
2. **After**: Set `REACT_APP_*` vars when starting the Docker container

The code changes are minimal - just import and use the `env` object from `src/utils/env.ts` instead of `process.env` directly.

## Security Considerations

- Runtime configuration is visible in browser DevTools (`window._env_`)
- **Google Maps API Key**: Must be restricted to HTTP referrers in Google Cloud Console
- Do NOT put other secrets (passwords, private API keys) in these environment variables
- Use backend proxies or secret management systems for sensitive data
- All values in `env-config.js` are public and served to the client

### API Key Security Checklist

Before deploying with a Google Maps API Key:

- [ ] Restrict key to HTTP referrers (your domain only)
- [ ] Restrict key to Maps JavaScript API only
- [ ] Set up billing alerts in Google Cloud Console
- [ ] Consider using separate keys for development/staging/production
- [ ] Rotate keys periodically
- [ ] Monitor API usage for unexpected spikes

## Summary

| Aspect | Build-Time (Old) | Runtime (New) |
|--------|-----------------|---------------|
| When configured | Before `npm run build` | At container startup |
| Flexibility | Requires rebuild for changes | Change env vars, restart container |
| Docker image | Different image per environment | Same image, different config |
| Kubernetes | ConfigMap at build | ConfigMap at deployment |
