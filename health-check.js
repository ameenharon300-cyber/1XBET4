// Health check and monitoring system
const axios = require('axios');

class HealthMonitor {
    constructor() {
        this.startTime = new Date();
        this.checks = [];
    }

    async checkBotHealth() {
        try {
            const response = await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/getMe`);
            return response.data.ok;
        } catch (error) {
            return false;
        }
    }

    async checkDatabase() {
        try {
            // Check if database is accessible
            const stats = await dbManager.getAllUsers();
            return Array.isArray(stats);
        } catch (error) {
            return false;
        }
    }

    async fullHealthCheck() {
        const results = {
            bot: await this.checkBotHealth(),
            database: await this.checkDatabase(),
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };

        this.checks.push(results);
        
        // Keep only last 100 checks
        if (this.checks.length > 100) {
            this.checks = this.checks.slice(-100);
        }

        return results;
    }

    getStatus() {
        return {
            uptime: process.uptime(),
            startTime: this.startTime,
            totalChecks: this.checks.length,
            lastCheck: this.checks[this.checks.length - 1]
        };
    }
}

module.exports = HealthMonitor;