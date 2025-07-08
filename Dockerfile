#FROM ubuntu:latest
#LABEL authors="atropos"
#
#ENTRYPOINT ["top", "-b"]

From node:18-alpine

WORKDIR /app

COPY package.json ./

COPY . .

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "start"]

