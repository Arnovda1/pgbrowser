# --- BUILDER ---
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# --- RUNNER ---
FROM alpine:latest AS runner

RUN apk add --no-cache libstdc++

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p /app/data && chown -R appuser:appgroup /app

COPY --from=builder --chown=appuser:appgroup /app/dist/adminer-clone /app/adminer-clone

ENV NODE_ENV=production
USER appuser
EXPOSE 3000

CMD ["/app/adminer-clone"]