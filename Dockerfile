# Stage 1: Build
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (only production)
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Stage 2: Final
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]
