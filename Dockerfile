# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.13.0

# ------------------------------
# Dependencies
# ------------------------------
FROM node:${NODE_VERSION}-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# ------------------------------
# Tooling
#
# Contains source + dependencies.
# We can use this target for Prisma migrations.
# ------------------------------
FROM deps AS tooling

WORKDIR /app

COPY . .


# ------------------------------
# Build Next.js
# ------------------------------
FROM tooling AS builder

ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir -p public

RUN npm run build


# ------------------------------
# Production runtime
# ------------------------------
FROM node:${NODE_VERSION}-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# We use Docker host networking on the production server.
# Binding to loopback keeps Next.js off the public/LAN interfaces.
ENV HOSTNAME=127.0.0.1

RUN mkdir .next && chown node:node .next

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

CMD ["node", "server.js"]