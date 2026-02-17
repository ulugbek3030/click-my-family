#!/bin/bash
set -euo pipefail

###############################################
# CLICK My Family — Server Setup Script
# Run on a fresh Ubuntu 24.04 VPS (Hetzner CX32)
# Usage: curl -sSL <raw-github-url> | bash
#   or:  bash deploy/setup-server.sh
###############################################

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✗]${NC} $1"; exit 1; }

echo "==========================================="
echo "  CLICK My Family — Server Setup"
echo "==========================================="
echo ""

# 1. System update
log "Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

# 2. Install Docker
if ! command -v docker &> /dev/null; then
    log "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    log "Docker installed: $(docker --version)"
else
    log "Docker already installed: $(docker --version)"
fi

# 3. Install Docker Compose plugin
if ! docker compose version &> /dev/null; then
    log "Installing Docker Compose plugin..."
    apt-get install -y -qq docker-compose-plugin
fi
log "Docker Compose: $(docker compose version)"

# 4. Install Git
if ! command -v git &> /dev/null; then
    log "Installing Git..."
    apt-get install -y -qq git
fi

# 5. Setup firewall
log "Configuring firewall..."
apt-get install -y -qq ufw
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw --force enable
log "Firewall configured (SSH, HTTP, HTTPS only)"

# 6. Create app directory
APP_DIR="/opt/my-family"
mkdir -p "$APP_DIR"

# 7. Clone repository
if [ ! -d "$APP_DIR/.git" ]; then
    log "Cloning repository..."
    git clone https://github.com/ulugbek3030/click-my-family.git "$APP_DIR"
else
    log "Repository exists, pulling latest..."
    cd "$APP_DIR" && git pull origin main
fi

cd "$APP_DIR"

# 8. Generate .env file if not exists
if [ ! -f "$APP_DIR/.env" ]; then
    warn "Creating .env file — EDIT THIS with your real values!"

    # Generate random passwords
    DB_PASS=$(openssl rand -hex 16)
    RABBIT_PASS=$(openssl rand -hex 16)
    ADMIN_SECRET=$(openssl rand -hex 32)

    cat > "$APP_DIR/.env" << ENVEOF
# ==========================================
# CLICK My Family — Production Environment
# ==========================================

# PostgreSQL
DB_DATABASE=my_family
DB_USERNAME=my_family_user
DB_PASSWORD=${DB_PASS}

# RabbitMQ
RABBITMQ_USER=my_family_user
RABBITMQ_PASS=${RABBIT_PASS}

# CLICK Core Integration (GET FROM CLICK TEAM)
CLICK_CORE_BASE_URL=https://api.click.uz/core/v1
CLICK_CORE_API_KEY=CHANGE_ME
CLICK_JWT_PUBLIC_KEY=CHANGE_ME

# Admin Panel
ADMIN_JWT_SECRET=${ADMIN_SECRET}
ADMIN_JWT_EXPIRES_IN=8h

# Domain (set your domain here for SSL)
DOMAIN=
ENVEOF

    log "Generated .env with random passwords at $APP_DIR/.env"
    warn "⚠️  Edit CLICK_CORE_API_KEY and CLICK_JWT_PUBLIC_KEY before starting!"
else
    log ".env file already exists"
fi

# 9. Setup swap (important for 8GB VPS)
if [ ! -f /swapfile ]; then
    log "Creating 2GB swap..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log "Swap enabled"
fi

# 10. Setup log rotation for Docker
cat > /etc/docker/daemon.json << 'DJEOF'
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
DJEOF
systemctl restart docker

echo ""
log "==========================================="
log "  Server setup complete!"
log "==========================================="
echo ""
echo "Next steps:"
echo "  1. Edit /opt/my-family/.env with CLICK API keys"
echo "  2. Run: cd /opt/my-family && bash deploy/deploy.sh"
echo ""
