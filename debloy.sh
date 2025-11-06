#!/bin/bash

# ===================================================
# 🚀 AI GOAL PREDICTOR - DEPLOYMENT SCRIPT
# ===================================================

echo "🤖 Starting AI Goal Predictor Deployment..."
echo "🕒 $(date)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[STATUS]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node >/dev/null 2>&1; then
        print_success "Node.js found: $(node --version)"
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm >/dev/null 2>&1; then
        print_success "npm found: $(npm --version)"
    else
        print_error "npm is not installed."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    if npm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
}

# Check environment variables
check_env() {
    print_status "Checking environment variables..."
    
    if [ -z "$BOT_TOKEN" ]; then
        print_warning "BOT_TOKEN is not set. Please set it in .env file"
    else
        print_success "BOT_TOKEN is set"
    fi
    
    if [ -z "$ADMIN_ID" ]; then
        print_warning "ADMIN_ID is not set. Please set it in .env file"
    else
        print_success "ADMIN_ID is set"
    fi
    
    if [ -z "$OPENAI_API_KEY" ]; then
        print_warning "OPENAI_API_KEY is not set. Some features may not work"
    else
        print_success "OPENAI_API_KEY is set"
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p logs
    mkdir -p config
    mkdir -p public
    mkdir -p scripts
    print_success "Directories created"
}

# Set up log rotation
setup_logs() {
    print_status "Setting up log rotation..."
    cat > logs/rotate.sh << 'EOF'
#!/bin/bash
# Log rotation script
LOG_FILE="bot.log"
DATE=$(date +%Y%m%d_%H%M%S)

if [ -f "$LOG_FILE" ]; then
    mv "$LOG_FILE" "logs/bot_${DATE}.log"
    echo "Log rotated: logs/bot_${DATE}.log"
fi

# Keep only last 7 log files
ls -t logs/bot_*.log | tail -n +8 | xargs rm -f
EOF
    
    chmod +x logs/rotate.sh
    print_success "Log rotation setup completed"
}

# Create systemd service file (for Linux servers)
create_systemd_service() {
    if [ "$EUID" -ne 0 ]; then
        print_warning "Not running as root. Skipping systemd service creation."
        return
    fi
    
    print_status "Creating systemd service..."
    cat > /etc/systemd/system/ai-goal-predictor.service << EOF
[Unit]
Description=AI Goal Predictor Bot
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=$(pwd)
Environment=NODE_ENV=production
ExecStart=/usr/bin/node bot.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    systemctl daemon-reload
    print_success "Systemd service created"
}

# Create PM2 ecosystem file (alternative to systemd)
create_pm2_ecosystem() {
    print_status "Creating PM2 ecosystem file..."
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ai-goal-predictor',
    script: 'bot.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true
  }]
};
EOF
    print_success "PM2 ecosystem file created"
}

# Create backup script
create_backup_script() {
    print_status "Creating backup script..."
    cat > scripts/backup.sh << 'EOF'
#!/bin/bash
# Backup script for AI Goal Predictor

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups"
BACKUP_FILE="backup_${DATE}.tar.gz"

echo "Creating backup: $BACKUP_FILE"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup important files
tar -czf $BACKUP_DIR/$BACKUP_FILE \
    bot.js \
    package.json \
    package-lock.json \
    .env \
    config/ \
    logs/ 2>/dev/null

if [ $? -eq 0 ]; then
    echo "Backup created successfully: $BACKUP_DIR/$BACKUP_FILE"
    
    # Remove backups older than 7 days
    find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
    echo "Cleaned up old backups"
else
    echo "Backup failed"
    exit 1
fi
EOF
    
    chmod +x scripts/backup.sh
    print_success "Backup script created"
}

# Create update script
create_update_script() {
    print_status "Creating update script..."
    cat > scripts/update.sh << 'EOF'
#!/bin/bash
# Update script for AI Goal Predictor

echo "🔄 Starting update process..."

# Backup current version
./scripts/backup.sh

# Pull latest changes (if using git)
if [ -d .git ]; then
    git pull origin main
else
    echo "Not a git repository. Manual update required."
fi

# Install any new dependencies
npm install

# Restart the application
if command -v pm2 >/dev/null 2>&1; then
    pm2 restart ai-goal-predictor
    echo "Application restarted using PM2"
elif command -v systemctl >/dev/null 2>&1; then
    systemctl restart ai-goal-predictor
    echo "Application restarted using systemd"
else
    echo "Please restart the application manually"
fi

echo "✅ Update completed"
EOF
    
    chmod +x scripts/update.sh
    print_success "Update script created"
}

# Main deployment function
main() {
    echo "🚀 Starting AI Goal Predictor Deployment..."
    echo "=============================================="
    
    # Run checks
    check_node
    check_npm
    
    # Create directories
    create_directories
    
    # Install dependencies
    install_dependencies
    
    # Check environment
    check_env
    
    # Setup logs
    setup_logs
    
    # Create backup script
    create_backup_script
    
    # Create update script
    create_update_script
    
    # Create PM2 ecosystem file
    create_pm2_ecosystem
    
    # Try to create systemd service (only if root)
    create_systemd_service
    
    echo ""
    echo "=============================================="
    print_success "Deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Edit the .env file with your actual credentials"
    echo "2. Start the bot with: npm start"
    echo "3. Or using PM2: pm2 start ecosystem.config.js"
    echo "4. Or using systemd: systemctl start ai-goal-predictor"
    echo ""
    echo "🔧 Useful commands:"
    echo "   ./scripts/backup.sh    - Create backup"
    echo "   ./scripts/update.sh    - Update the application"
    echo "   pm2 logs              - View logs (if using PM2)"
    echo ""
    echo "📞 Support: @GEMZGOOLBOT"
    echo "=============================================="
}

# Run main function
main