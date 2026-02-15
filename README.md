# Moon Phase API

REST API that returns current moon phase data. Originally built to control a 6-LED moon light display.

## Endpoints

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/health` | Health check | `{"status":"ok"}` |
| GET | `/moon` | LED count for current moon phase | `0`-`6` |
| GET | `/moon/phase` | Raw moon illumination phase | `0.0`-`1.0` (0=new, 0.5=full) |
| GET | `/moon/up` | Whether the moon has risen (Pittsburgh, PA) | `true` or `false` |

## Run Locally

```bash
npm install
PORT=3001 node index.js
```

## Docker

```bash
docker compose up -d
```

The API will be available at `http://localhost:3001`.

## Test

```bash
npm test
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port to listen on |
| `TZ` | — | Timezone (set to `America/New_York` in Docker) |

## License

MIT
