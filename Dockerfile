# Base stage
FROM node:20-alpine AS base

# Install dependencies stage
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

ARG DATABASE_URL
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_BUCKET_NAME

ENV DATABASE_URL=$DATABASE_URL
ENV AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
ENV AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
ENV AWS_REGION=$AWS_REGION
ENV AWS_BUCKET_NAME=$AWS_BUCKET_NAME

# Generate database migrations
RUN npm run db:generate

# Build the Next.js application
RUN npm run build

# Production runner stage
FROM base AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Create system group and user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy node_modules for migration tools (drizzle-kit, tsx)
COPY --from=deps /app/node_modules ./node_modules

# Copy package.json for npm scripts
COPY --from=builder /app/package.json ./package.json

# Copy drizzle config and migrations
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/src/lib/db ./src/lib/db

# Copy scripts for admin creation
COPY --from=builder /app/scripts ./scripts

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set port environment variable
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
