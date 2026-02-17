#!/bin/bash
set -euo pipefail

###############################################
# CLICK My Family — Deploy / Update Script
# Usage: bash deploy/deploy.sh [--ssl your-domain.com]
###############################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

APP_DIR="/opt/my-family"
cd "$APP_DIR"

echo "==========================================="
echo "  CLICK My Family — Deploy"
echo "==========================================="
echo ""

# Check .env exists
[ -f .env ] || err ".env file not found! Run setup-server.sh first."

# Parse --ssl flag
DOMAIN=""
if [ "${1:-}" = "--ssl" ] && [ -n "${2:-}" ]; then
    DOMAIN="$2"
    log "SSL will be configured for: $DOMAIN"
fi

# Pull latest code
log "Pulling latest code..."
git pull origin main 2>/dev/null || warn "Git pull failed (not critical)"

# Build all services
log "Building Docker images (this takes 3-5 minutes first time)..."
docker compose -f docker-compose.prod.yml build --parallel 2>&1

# Stop existing services
log "Stopping existing services..."
docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true

# Start infrastructure first
log "Starting infrastructure (PostgreSQL, Redis, RabbitMQ)..."
docker compose -f docker-compose.prod.yml up -d postgres redis rabbitmq

# Wait for infrastructure
log "Waiting for infrastructure to be healthy..."
sleep 10
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml ps | grep -q "(healthy)"; then
        break
    fi
    echo -n "."
    sleep 2
done
echo ""

# Start all microservices
log "Starting all microservices..."
docker compose -f docker-compose.prod.yml up -d

# Wait for services to start
sleep 15

# SSL setup
if [ -n "$DOMAIN" ]; then
    log "Obtaining SSL certificate for $DOMAIN..."

    # Replace domain in nginx config
    sed -i "s/YOUR_DOMAIN/$DOMAIN/g" deploy/nginx/conf.d/default.conf

    # Get certificate
    docker compose -f docker-compose.prod.yml run --rm certbot \
        certbot certonly --webroot \
        --webroot-path=/var/www/certbot \
        --email admin@$DOMAIN \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN 2>&1 || warn "SSL cert failed — check DNS settings"

    # Uncomment HTTPS block in nginx
    sed -i 's/^# //g' deploy/nginx/conf.d/default.conf

    # Reload nginx
    docker compose -f docker-compose.prod.yml restart nginx
    log "SSL configured for $DOMAIN"
fi

# Show status
echo ""
log "==========================================="
log "  Deployment complete!"
log "==========================================="
echo ""
echo "Service status:"
docker compose -f docker-compose.prod.yml ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "YOUR_IP")

echo "Access points:"
if [ -n "$DOMAIN" ]; then
    echo "  🌐 API:     https://$DOMAIN/api/"
    echo "  📚 Swagger: https://$DOMAIN/docs"
    echo "  🔧 Admin:   https://$DOMAIN/admin/"
else
    echo "  🌐 API:     http://$SERVER_IP/api/"
    echo "  📚 Swagger: http://$SERVER_IP/docs"
    echo "  🔧 Admin:   http://$SERVER_IP/admin/"
fi
echo ""
echo "Useful commands:"
echo "  Logs:      docker compose -f docker-compose.prod.yml logs -f"
echo "  Status:    docker compose -f docker-compose.prod.yml ps"
echo "  Restart:   docker compose -f docker-compose.prod.yml restart"
echo "  Stop:      docker compose -f docker-compose.prod.yml down"
echo "  Update:    git pull && bash deploy/deploy.sh"
echo ""
