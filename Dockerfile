# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:18-alpine
WORKDIR /app

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Runtime configuration
ENV NODE_ENV=production \
    PORT=4000 \
    ALLOWED_ORIGINS="https://ce-grp-3a-my-app2.sctp-sandbox.com"

EXPOSE 4000
USER node
CMD ["node", "fraud.js"]