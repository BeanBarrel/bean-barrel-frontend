# ---------- STAGE 1: Build ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Next.js app
RUN npm run build

# ---------- STAGE 2: Production ----------
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package.json and package-lock.json
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the build output and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public



# Expose port
EXPOSE 3000

# Run the app
CMD ["npm", "start"]
