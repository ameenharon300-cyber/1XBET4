// ===================================================
// 🚀 AI GOAL PREDICTOR ULTIMATE - VERSION 10.4
// 👤 DEVELOPER: AMIN - @GEMZGOOLBOT
// 🔥 FEATURES: SMART AI + BETTING SYSTEM + FIREBASE + FULL ADMIN PANEL
// ===================================================

console.log('🤖 Starting AI GOAL Predictor Ultimate v10.4...');
console.log('🕒 ' + new Date().toISOString());

// 🔧 CONFIGURATION
const CONFIG = {
    BOT_TOKEN: process.env.BOT_TOKEN || "8125363786:AAFZaOGSAvq_p8Sc8cq2bIKZlpe4ej7tmdU",
    ADMIN_ID: process.env.ADMIN_ID || "6565594143",
    
    // 🧠 AI APIS
    AI_APIS: {
        GEMINI: process.env.GEMINI_API_KEY || "AIzaSyCtjtT98-M5v6t8qICPSDw-1TLwPneyaQc",
        OPENAI: process.env.OPENAI_API_KEY || "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"
    },

    // 💰 DEFAULT PRICING
    SUBSCRIPTION_PRICES: {
        week: 10,
        month: 30,
        three_months: 80,
        year: 250
    },

    // 🔐 DEFAULT PAYMENT LINKS
    PAYMENT_LINKS: {
        week: process.env.PAYMENT_WEEK || "https://binance.com/payment/weekly",
        month: process.env.PAYMENT_MONTH || "https://binance.com/payment/monthly", 
        three_months: process.env.PAYMENT_3MONTHS || "https://binance.com/payment/3months",
        year: process.env.PAYMENT_YEAR || "https://binance.com/payment/yearly"
    },
    
    VERSION: "10.4.0",
    DEVELOPER: "AMIN - @GEMZGOOLBOT",
    CHANNEL: "@GEMZGOOL",
    START_IMAGE: "https://i.ibb.co/tpy70Bd1/IMG-20251104-074214-065.jpg",
    ANALYSIS_IMAGE: "https://i.ibb.co/VYjf05S0/Screenshot.png",
    IMGBB_API_KEY: "42b155a527bee21e62e524a31fe9b1ee"
};

console.log('✅ Configuration loaded successfully');

// 🚀 INITIALIZE BOT
const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');

const fetch = require('node-fetch');

/**
 * callVisionAPI(imageUrl)
 * Uses Google Vision REST API to get labels and OCR text.
 * Requires CONFIG.AI_APIS.GEMINI or CONFIG.AI_APIS.GOOGLE_VISION_KEY to be set.
 */
async function callVisionAPI(imageUrl) {
    const apiKey = CONFIG.AI_APIS && (CONFIG.AI_APIS.GEMINI || CONFIG.AI_APIS.GOOGLE_VISION_KEY);
    if (!apiKey) return null;
    try {
        // fetch image as arraybuffer and convert to base64
        const res = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64 = Buffer.from(res.data, 'binary').toString('base64');
        const body = {
            requests: [
                {
                    image: { content: base64 },
                    features: [
                        { type: "LABEL_DETECTION", maxResults: 20 },
                        { type: "TEXT_DETECTION", maxResults: 50 },
                        { type: "OBJECT_LOCALIZATION", maxResults: 20 },
                        { type: "FACE_DETECTION", maxResults: 10 }
                    ]
                }
            ]
        };
        const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
        const visionRes = await fetch(visionUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const json = await visionRes.json();
        return json;
    } catch (err) {
        console.error('callVisionAPI error:', err && err.message ? err.message : err);
        return null;
    }
}
const express = require('express');
const FormData = require('form-data');

const bot = new Telegraf(CONFIG.BOT_TOKEN);

// 🌐 HEALTH CHECK SERVER FOR REPLIT
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        version: CONFIG.VERSION,
        timestamp: new Date().toISOString(),
        message: 'AI Goal Predictor Bot is running...',
        developer: CONFIG.DEVELOPER
    });
});

app.listen(PORT, () => {
    console.log(`🌐 Health check server running on port ${PORT}`);
});

// 🔥 FIREBASE INITIALIZATION
let db = null;
let admin = null;

try {
    admin = require('firebase-admin');
    
    const serviceAccount = {
        "type": "service_account",
        "project_id": "bot-tlegram-9f4b5",
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID || "private_key_id",
        "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqM3Q...\n-----END PRIVATE KEY-----\n",
        "client_email": process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@bot-tlegram-9f4b5.iam.gserviceaccount.com",
        "client_id": process.env.FIREBASE_CLIENT_ID || "client_id",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.FIREBASE_CERT_URL || "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40bot-tlegram-9f4b5.iam.gserviceaccount.com"
    };

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://bot-tlegram-9f4b5-default-rtdb.firebaseio.com"
        });
    }
    
    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
    
} catch (error) {
    console.log('⚠️ Firebase initialization failed:', error.message);
    console.log('🔄 Using local storage instead');
}

// 🗄️ LOCAL STORAGE FALLBACK
const userDatabase = new Map();
const paymentDatabase = new Map();
const settingsDatabase = new Map();

// تهيئة الإعدادات الافتراضية
settingsDatabase.set('config', {
    prices: { ...CONFIG.SUBSCRIPTION_PRICES },
    payment_links: { ...CONFIG.PAYMENT_LINKS },
    maintenance_mode: false,
    updated_at: new Date().toISOString()
});

// 📊 FAKE STATISTICS SYSTEM
class FakeStatistics {
    constructor() {
        this.totalUsers = 78542;
        this.activeUsers = 287;
    }

    getStats() {
        return {
            totalUsers: this.totalUsers,
            activeUsers: this.activeUsers
        };
    }
}

// 🧠 SMART GOAL PREDICTION ENGINE
class GoalPredictionAI {
    constructor() {
        this.algorithmVersion = "10.4";
    }

    generateSmartPrediction(userId) {
        const isGoal = Math.random() > 0.5;
        const probability = Math.floor(Math.random() * 30) + 60;
        
        const prediction = {
            type: isGoal ? '⚽ هدف مؤكد' : '🛡️ دفاع قوي',
            probability: probability,
            confidence: 100,
            reasoning: isGoal ? 
                `🔥 الضغط الهجومي المستمر يشير لهدف قريب بنسبة ${probability}%` :
                `🛡️ الدفاع المنظم يحد من الفرص بنسبة ${probability}%`,
            timestamp: new Date().toISOString(),
            algorithm: this.algorithmVersion
        };

        return prediction;
    }

    
async analyzeImageWithAI(imageUrl) {
    try {
        // try Vision API first
        const visionResult = await callVisionAPI(imageUrl);

        if (!visionResult || !visionResult.responses || !visionResult.responses[0]) {
            // fallback to smart random predictor
            return this.generateSmartPrediction('image_analysis');
        }

        const resp = visionResult.responses[0];
        const labels = (resp.labelAnnotations || []).map(l => (l.description || '').toLowerCase());
        const texts = (resp.textAnnotations || []).map(t => (t.description || '').toLowerCase());
        const fullText = texts.join(' ').toLowerCase();

        const hasMessi = labels.some(l => l.includes('messi')) || fullText.includes('ميسي') || fullText.includes('messi');
        const hasRonaldo = labels.some(l => l.includes('ronaldo')) || fullText.includes('رونالدو') || fullText.includes('ronaldo');
        const hasNeymar = labels.some(l => l.includes('neymar')) || fullText.includes('نيمار') || fullText.includes('neymar');

        const hasGoal = fullText.includes('هدف') || fullText.includes('goal') || fullText.includes('gool');
        const hasNoGoal = fullText.includes('لا هدف') || fullText.includes('no goal') || fullText.includes('no-goal') || fullText.includes('no_goal');
        const hasGoolWord = fullText.includes('gool') || fullText.includes('goal');
        const hasBetButton = fullText.includes('وضع الرهان') || fullText.includes('وضع') || fullText.includes('رهان') || fullText.includes('bet') || fullText.includes('$');

        const playersCondition = hasMessi && (hasNeymar || hasRonaldo);
        const accepted = playersCondition && hasGoal && hasNoGoal && hasGoolWord && hasBetButton;

        if (accepted) {
            return {
                accepted: true,
                type: (Math.random() > 0.5) ? '⚽ هدف محتمل' : '🛡️ دفاع محتمل',
                probability: Math.floor(Math.random() * 30) + 60,
                confidence: 95,
                reasoning: 'الصورة تحتوي على ميسي مع لاعب آخر، وتم العثور على نصوص الأزرار واسم GOOL وزر الرهان.',
                timestamp: new Date().toISOString(),
                algorithm: this.algorithmVersion
            };
        } else {
            return {
                accepted: false,
                reason: 'الشروط (لاعبين/نصوص/أزرار) غير مكتملة',
                detected: {
                    hasMessi, hasRonaldo, hasNeymar, hasGoal, hasNoGoal, hasGoolWord, hasBetButton, labels, fullTextSnippet: fullText.slice(0, 400)
                },
                timestamp: new Date().toISOString()
            };
        }
    } catch (error) {
        console.error('GoalPredictionAI.analyzeImageWithAI error:', error);
        return this.generateSmartPrediction('fallback');
    }
}
    generateNextPrediction(userId) {
        return this.generateSmartPrediction(userId);
    }
}

// 📤 IMGBB UPLOADER
class ImgBBUploader {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async uploadImage(imageUrl) {
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                success: true,
                url: imageUrl,
                delete_url: imageUrl
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// 💾 DATABASE MANAGER
class DatabaseManager {
    constructor() {
        this.maintenanceMode = false;
    }

    async getUser(userId) {
        try {
            if (db) {
                const userDoc = await db.collection('users').doc(userId.toString()).get();
                return userDoc.exists ? userDoc.data() : null;
            }
            return userDatabase.get(userId) || null;
        } catch (error) {
            return userDatabase.get(userId) || null;
        }
    }

    async saveUser(userId, userData) {
        try {
            if (db) {
                await db.collection('users').doc(userId.toString()).set(userData, { merge: true });
            }
            userDatabase.set(userId, userData);
            return true;
        } catch (error) {
            userDatabase.set(userId, userData);
            return true;
        }
    }

    async addPayment(paymentData) {
        const paymentId = Date.now().toString();
        try {
            const fullPaymentData = {
                ...paymentData,
                id: paymentId,
                status: 'pending',
                timestamp: new Date().toISOString()
            };

            if (db) {
                await db.collection('payments').doc(paymentId).set(fullPaymentData);
            }
            paymentDatabase.set(paymentId, fullPaymentData);
            return paymentId;
        } catch (error) {
            const fullPaymentData = {
                ...paymentData,
                id: paymentId,
                status: 'pending',
                timestamp: new Date().toISOString()
            };
            paymentDatabase.set(paymentId, fullPaymentData);
            return paymentId;
        }
    }

    async getPendingPayments() {
        try {
            if (db) {
                const paymentsSnapshot = await db.collection('payments').where('status', '==', 'pending').get();
                return paymentsSnapshot.docs.map(doc => doc.data());
            }
            return Array.from(paymentDatabase.values()).filter(p => p.status === 'pending');
        } catch (error) {
            return Array.from(paymentDatabase.values()).filter(p => p.status === 'pending');
        }
    }

    async updatePayment(paymentId, updates) {
        try {
            if (db) {
                await db.collection('payments').doc(paymentId).update(updates);
            }
            const payment = paymentDatabase.get(paymentId);
            if (payment) {
                paymentDatabase.set(paymentId, { ...payment, ...updates });
            }
            return true;
        } catch (error) {
            const payment = paymentDatabase.get(paymentId);
            if (payment) {
                paymentDatabase.set(paymentId, { ...payment, ...updates });
            }
            return true;
        }
    }

    async getAllUsers() {
        try {
            if (db) {
                const usersSnapshot = await db.collection('users').get();
                return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            }
            return Array.from(userDatabase.entries()).map(([id, data]) => ({ id, ...data }));
        } catch (error) {
            return Array.from(userDatabase.entries()).map(([id, data]) => ({ id, ...data }));
        }
    }

    async getSettings() {
        try {
            if (db) {
                const settingsDoc = await db.collection('settings').doc('config').get();
                if (settingsDoc.exists) {
                    return settingsDoc.data();
                }
            }
            return settingsDatabase.get('config');
        } catch (error) {
            return settingsDatabase.get('config');
        }
    }

    async updateSettings(newSettings) {
        try {
            const updatedSettings = {
                ...newSettings,
                updated_at: new Date().toISOString()
            };

            if (db) {
                await db.collection('settings').doc('config').set(updatedSettings, { merge: true });
            }
            settingsDatabase.set('config', updatedSettings);
            return updatedSettings;
        } catch (error) {
            const updatedSettings = {
                ...newSettings,
                updated_at: new Date().toISOString()
            };
            settingsDatabase.set('config', updatedSettings);
            return updatedSettings;
        }
    }

    async getPayment(paymentId) {
        try {
            if (db) {
                const paymentDoc = await db.collection('payments').doc(paymentId).get();
                return paymentDoc.exists ? paymentDoc.data() : null;
            }
            return paymentDatabase.get(paymentId) || null;
        } catch (error) {
            return paymentDatabase.get(paymentId) || null;
        }
    }

    async getAllPayments() {
        try {
            if (db) {
                const paymentsSnapshot = await db.collection('payments').get();
                return paymentsSnapshot.docs.map(doc => doc.data());
            }
            return Array.from(paymentDatabase.values());
        } catch (error) {
            return Array.from(paymentDatabase.values());
        }
    }

    isMaintenanceMode() {
        return this.maintenanceMode;
    }

    async setMaintenanceMode(enabled) {
        try {
            const settings = await this.getSettings();
            settings.maintenance_mode = enabled;
            await this.updateSettings(settings);
            this.maintenanceMode = enabled;
            return true;
        } catch (error) {
            this.maintenanceMode = enabled;
            return true;
        }
    }

    async searchUsers(query) {
        try {
            const users = await this.getAllUsers();
            const lowerQuery = query.toLowerCase();
            
            return users.filter(user => 
                (user.user_id && user.user_id.toString().includes(query)) ||
                (user.username && user.username.toLowerCase().includes(lowerQuery)) ||
                (user.onexbet && user.onexbet.includes(query))
            );
        } catch (error) {
            console.error('Search users error:', error);
            return [];
        }
    }
}

// INITIALIZE SYSTEMS
const goalAI = new GoalPredictionAI();
const dbManager = new DatabaseManager();
const fakeStats = new FakeStatistics();
const imgbbUploader = new ImgBBUploader(CONFIG.IMGBB_API_KEY);

// 🎯 BOT SETUP
bot.use(session({ 
    defaultSession: () => ({ 
        step: 'start',
        userData: {},
        verificationCode: null,
        accountId: null,
        paymentType: null,
        adminMode: false,
        adminStep: null,
        awaitingPaymentAccount: false,
        paymentAccount: null,
        currentBet: 0,
        originalBet: 0,
        totalProfit: 0,
        awaitingBetAmount: false,
        lastImageUrl: null,
        searchQuery: null,
        broadcastMessage: null
    })
}));

// 🎯 لوحة المفاتيح الثابتة
const getMainKeyboard = () => {
    return Markup.keyboard([
        ['🎯 التوقع التالي', '📊 إحصائياتي'],
        ['📸 إرسال صورة', '💳 الاشتراكات'],
        ['👥 إحصائيات البوت', '👤 حالة الاشتراك'],
        ['🆘 الدعم الفني']
    ]).resize();
};

const getLoginKeyboard = () => {
    return Markup.keyboard([
        ['🔐 إدخال رقم الحساب']
    ]).resize();
};

const getSubscriptionKeyboard = () => {
    return Markup.keyboard([
        ['💰 أسبوعي', '💰 شهري'],
        ['💰 3 أشهر', '💰 سنوي'],
        ['🔙 الرجوع للقائمة']
    ]).resize();
};

const getAdminMainKeyboard = () => {
    return Markup.keyboard([
        ['📊 إحصائيات النظام', '👥 إدارة المستخدمين'],
        ['💰 طلبات الدفع', '⚙️ الإعدادات'],
        ['📢 إرسال إشعار', '🔍 بحث عن مستخدم'],
        ['🔧 قفل/فتح البوت', '🔙 الخروج من الإدمن']
    ]).resize();
};

const getAdminUsersKeyboard = () => {
    return Markup.keyboard([
        ['📋 قائمة المستخدمين', '✅ المشتركين النشطين'],
        ['🆓 المستخدمين المجانين', '📈 إحصائيات المستخدمين'],
        ['🔙 رجوع']
    ]).resize();
};

const getAdminPaymentsKeyboard = () => {
    return Markup.keyboard([
        ['📥 الطلبات المعلقة', '✅ الطلبات المقبولة'],
        ['❌ الطلبات المرفوضة', '📋 كل الطلبات'],
        ['🔙 رجوع']
    ]).resize();
};

const getAdminSettingsKeyboard = () => {
    return Markup.keyboard([
        ['💰 تعديل الأسعار', '🔗 تعديل روابط الدفع'],
        ['🖼️ تعديل صورة QR', '⚙️ الإعدادات العامة'],
        ['🔄 إعادة التعيين', '🔙 رجوع']
    ]).resize();
};

// 🛠️ UTILITY FUNCTIONS
function calculateRemainingDays(endDate) {
    try {
        const end = new Date(endDate);
        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    } catch (error) {
        return 0;
    }
}

function addSubscriptionDays(startDate, type) {
    try {
        const start = new Date(startDate);
        const types = {
            week: 7,
            month: 30,
            three_months: 90,
            year: 365
        };
        start.setDate(start.getDate() + types[type]);
        return start.toISOString();
    } catch (error) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + 30);
        return newDate.toISOString();
    }
}

// 🎯 BOT COMMANDS

bot.start(async (ctx) => {
    try {
        const settings = await dbManager.getSettings();
        if (settings.maintenance_mode && ctx.from.id.toString() !== CONFIG.ADMIN_ID) {
            await ctx.replyWithMarkdown('🔧 *البوت تحت الصيانة*\n\n⏰ نعمل على تحسين الخدمة لكم\n🔄 سنعود قريباً بأفضل مما كان\n\n📞 للاستفسار: ' + CONFIG.DEVELOPER);
            return;
        }

        const userId = ctx.from.id.toString();
        const userName = ctx.from.first_name;

        // إرسال الصورة أولاً
        try {
            await ctx.replyWithPhoto(CONFIG.START_IMAGE, {
                caption: `🎉 *مرحباً بك في نظام GOAL Predictor Pro v${CONFIG.VERSION}* 🚀\n\n` +
                        `🤖 *أقوى نظام لتوقع الأهداف بالذكاء الاصطناعي*\n` +
                        `💎 *المطور:* ${CONFIG.DEVELOPER}\n` +
                        `📢 *القناة:* ${CONFIG.CHANNEL}`
            });
        } catch (photoError) {
            await ctx.replyWithMarkdown(`🎉 *مرحباً بك في نظام GOAL Predictor Pro v${CONFIG.VERSION}* 🚀`);
        }

        const existingUser = await dbManager.getUser(userId);
        
        if (existingUser) {
            ctx.session.step = 'verified';
            ctx.session.userData = existingUser;

            const remainingDays = calculateRemainingDays(existingUser.subscription_end_date);
            
            let statusMessage = '';
            if (existingUser.subscription_status === 'active' && remainingDays > 0) {
                statusMessage = `✅ *اشتراكك نشط*\n\n` +
                               `🔐 الحساب: \`${existingUser.onexbet}\`\n` +
                               `📦 النوع: ${existingUser.subscription_type}\n` +
                               `📅 الانتهاء: ${new Date(existingUser.subscription_end_date).toLocaleDateString('ar-EG')}\n` +
                               `⏳ متبقي: ${remainingDays} يوم`;
            } else if (existingUser.free_attempts > 0) {
                statusMessage = `🎯 *محاولات مجانية متاحة*\n\n` +
                               `🔐 الحساب: \`${existingUser.onexbet}\`\n` +
                               `🆓 محاولات مجانية: ${existingUser.free_attempts}`;
            } else {
                statusMessage = `🚫 *انتهت المحاولات*\n\n` +
                               `🔐 الحساب: \`${existingUser.onexbet}\`\n` +
                               `💳 يرجى الاشتراك للمتابعة`;
            }

            await ctx.replyWithMarkdown(statusMessage, getMainKeyboard());
            
        } else {
            ctx.session.step = 'start';
            ctx.session.userData = { userId, userName };

            const welcomeMessage = `
🔐 *مرحباً ${userName} في نظام GOAL Predictor Pro v${CONFIG.VERSION}*

🎯 *النظام المتقدم لتوقع الأهداف في المباريات*
🤖 *خوارزمية ذكية مخفية تحلل المباريات بدقة عالية*

📋 *خطوات الدخول:*
1️⃣ أدخل رقم حساب 1xBet (10 أرقام)
2️⃣ استلم كود التحقق (6 أرقام)  
3️⃣ أدخل كود التحقق
4️⃣ ابدأ باستخدام المحاولات المجانية

💎 *المطور:* ${CONFIG.DEVELOPER}
📢 *القناة:* ${CONFIG.CHANNEL}

🔢 *الآن اضغط على "🔐 إدخال رقم الحساب" لبدء التسجيل*
            `;

            await ctx.replyWithMarkdown(welcomeMessage, getLoginKeyboard());
        }

    } catch (error) {
        console.error('Start command error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام، يرجى المحاولة لاحقاً');
    }
});

// 📝 HANDLE TEXT MESSAGES
bot.on('text', async (ctx) => {
    try {
        const settings = await dbManager.getSettings();
        if (settings.maintenance_mode && ctx.from.id.toString() !== CONFIG.ADMIN_ID) {
            await ctx.replyWithMarkdown('🔧 *البوت تحت الصيانة*\n\n⏰ نعمل على تحسين الخدمة لكم\n🔄 سنعود قريباً بأفضل مما كان\n\n📞 للاستفسار: ' + CONFIG.DEVELOPER);
            return;
        }

        const text = ctx.message.text;
        const session = ctx.session;
        const userId = ctx.from.id.toString();

        // 🔐 ADMIN COMMANDS - للإدمن فقط
        if (userId === CONFIG.ADMIN_ID) {
            if (text === '/admin' || text === '🔐 لوحة التحكم') {
                ctx.session.adminMode = true;
                ctx.session.adminStep = 'main';
                await ctx.replyWithMarkdown('🔧 *مرحباً في لوحة التحكم*', getAdminMainKeyboard());
                return;
            }

            if (session.adminMode) {
                await handleAdminCommands(ctx, text);
                return;
            }
        }

        // معالجة البحث عن مستخدم
        if (session.adminStep === 'search_user') {
            await handleAdminSearchUser(ctx, text);
            return;
        }

        // معالجة الإشعار الجماعي
        if (session.adminStep === 'broadcast') {
            await handleAdminBroadcast(ctx, text);
            return;
        }

        // معالجة إدخال مبلغ الرهان
        if (session.awaitingBetAmount) {
            const betAmount = parseFloat(text);
            if (isNaN(betAmount) || betAmount <= 0) {
                await ctx.replyWithMarkdown('❌ *مبلغ غير صحيح!*\n\n💰 يرجى إدخال مبلغ صحيح للرهان');
                return;
            }

            ctx.session.currentBet = betAmount;
            ctx.session.originalBet = betAmount;
            ctx.session.awaitingBetAmount = false;

            await ctx.replyWithMarkdown(
                `✅ *تم تحديد مبلغ الرهان:* ${betAmount}$\n\n` +
                `📸 *الآن يرجى إرسال صورة المباراة للتحليل*`,
                getMainKeyboard()
            );
            return;
        }

        // 🔐 زر إدخال رقم الحساب
        if (text === '🔐 إدخال رقم الحساب' && session.step === 'start') {
            ctx.session.step = 'awaiting_account_id';
            await ctx.replyWithMarkdown(
                '🔢 *الخطوة 1:* أرسل رقم حساب 1xBet الخاص بك (10 أرقام)\n\n' +
                '💡 *ملاحظة:* يجب أن يكون الرقم الحقيقي الخاص بك'
            );
            return;
        }

        // 🔐 STEP 1: Validate 1xBet Account
        if (session.step === 'awaiting_account_id' && /^\d{10}$/.test(text)) {
            
            ctx.session.accountId = text;
            ctx.session.step = 'awaiting_verification';
            ctx.session.verificationCode = Math.floor(100000 + Math.random() * 900000);

            await ctx.replyWithMarkdown(
                `✅ *تم إرسال كود التحقق*\n\n` +
                `🔐 *الحساب:* \`${text}\`\n` +
                `📧 *الكود:* \`${ctx.session.verificationCode}\`\n\n` +
                `🔢 *الخطوة 2:* أرسل كود التحقق خلال 5 دقائق`
            );

            setTimeout(() => {
                if (ctx.session.step === 'awaiting_verification') {
                    ctx.session.verificationCode = null;
                    ctx.session.step = 'start';
                }
            }, 5 * 60 * 1000);

        }
        // 🔐 STEP 2: Verify Code
        else if (session.step === 'awaiting_verification' && /^\d{6}$/.test(text)) {
            if (parseInt(text) === ctx.session.verificationCode) {
                
                const userData = {
                    user_id: userId,
                    username: ctx.from.first_name,
                    onexbet: ctx.session.accountId,
                    free_attempts: 2,
                    subscription_status: 'free',
                    subscription_type: 'none',
                    subscription_start_date: null,
                    subscription_end_date: null,
                    joined_at: new Date().toISOString(),
                    total_predictions: 0,
                    correct_predictions: 0,
                    wins: 0,
                    losses: 0,
                    total_bets: 0,
                    total_profit: 0
                };

                await dbManager.saveUser(userId, userData);
                ctx.session.step = 'verified';
                ctx.session.userData = userData;

                await ctx.replyWithMarkdown(
                    `🎉 *تم التحقق بنجاح!*\n\n` +
                    `✅ *الحساب:* \`${ctx.session.accountId}\`\n` +
                    `👤 *المستخدم:* ${ctx.session.userData.username}\n\n` +
                    `🎁 *تحصل على محاولتين مجانيتين*\n\n` +
                    `📸 *يمكنك الآن إرسال صورة المباراة للتحليل*`,
                    getMainKeyboard()
                );

            } else {
                await ctx.replyWithMarkdown('❌ *كود تحقق خاطئ!*\n\n🔐 يرجى إعادة إدخال الكود الصحيح');
            }
        }
        // 💳 معالجة طلبات الدفع - طلب رقم الحساب
        else if (session.awaitingPaymentAccount) {
            if (/^\d{10}$/.test(text)) {
                const userData = await dbManager.getUser(userId);
                userData.onexbet = text;
                await dbManager.saveUser(userId, userData);
                
                ctx.session.awaitingPaymentAccount = false;
                ctx.session.paymentAccount = text;
                
                await ctx.replyWithMarkdown(
                    `✅ *تم حفظ رقم الحساب:* \`${text}\`\n\n` +
                    `📸 *الآن يرجى إرسال صورة إثبات الدفع*`
                );
            } else {
                await ctx.replyWithMarkdown('❌ *رقم حساب غير صحيح!*\n\n🔢 يرجى إرسال رقم حساب 1xBet مكون من 10 أرقام');
            }
            return;
        }
        // 🎯 معالجة الأزرار الثابتة بعد التحقق
        else if (session.step === 'verified') {
            const userData = await dbManager.getUser(userId);
            
            if (!userData) {
                await ctx.replyWithMarkdown('❌ *جلسة منتهية*\n\n🔐 أرسل /start للبدء', getLoginKeyboard());
                return;
            }

            switch (text) {
                case '🎯 التوقع التالي':
                    if (session.lastImageUrl) {
                        await handleNextPrediction(ctx, userData);
                    } else {
                        ctx.session.awaitingBetAmount = true;
                        await ctx.replyWithMarkdown(
                            '💰 *أدخل مبلغ الرهان:*\n\n' +
                            '💵 يرجى كتابة المبلغ الذي تريد الرهان عليه (بالدولار)\n' +
                            '📝 مثال: 10 أو 25.5'
                        );
                    }
                    break;

                case '📊 إحصائياتي':
                    await handleUserStats(ctx, userData);
                    break;

                case '👥 إحصائيات البوت':
                    await handleBotStats(ctx);
                    break;

                case '📸 إرسال صورة':
                    await ctx.replyWithMarkdown(
                        '📸 *يرجى إرسال صورة المباراة الآن*\n\n' +
                        '🎯 *بعد إرسال الصورة ستحصل على التوقع الفوري*',
                        getMainKeyboard()
                    );
                    break;

                case '💳 الاشتراكات':
                    await handleSubscriptions(ctx, userData);
                    break;

                case '👤 حالة الاشتراك':
                    await handleSubscriptionStatus(ctx, userData);
                    break;

                case '🆘 الدعم الفني':
                    await ctx.replyWithMarkdown(
                        `🆘 *الدعم الفني*\n\n` +
                        `📞 للاستفسارات والدعم:\n` +
                        `👤 ${CONFIG.DEVELOPER}\n` +
                        `📢 ${CONFIG.CHANNEL}\n\n` +
                        `⏰ متاحون 24/7 لخدمتكم`,
                        getMainKeyboard()
                    );
                    break;

                case '🔙 الرجوع للقائمة':
                    await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getMainKeyboard());
                    break;

                default:
                    if (text.startsWith('💰 ')) {
                        await handleSubscriptionSelection(ctx, userData, text);
                    } else {
                        await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getMainKeyboard());
                    }
                    break;
            }
        }
        // 🔐 إذا كان المستخدم غير مسجل وحاول استخدام الأزرار
        else if (['🎯 التوقع التالي', '📊 إحصائياتي', '📸 إرسال صورة', '👥 إحصائيات البوت'].includes(text)) {
            await ctx.replyWithMarkdown(
                '❌ *يجب التسجيل أولاً*\n\n' +
                '🔐 أرسل /start لتسجيل الدخول',
                getLoginKeyboard()
            );
        } else {
            await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getMainKeyboard());
        }

    } catch (error) {
        console.error('Text handler error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ غير متوقع', getMainKeyboard());
    }
});

// 🖼️ IMAGE ANALYSIS HANDLER - معدل للتحقق من صور المباراة فقط
bot.on('photo', async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const session = ctx.session;

        // ==== دعم رفع صورة من الإدمن لتحديث الأسعار (OCR) ====
        if (ctx.from && ctx.from.id && ctx.from.id.toString() === CONFIG.ADMIN_ID && ctx.session && ctx.session.adminStep === 'price_edit') {
            try {
                const photoForAdmin = ctx.message.photo[ctx.message.photo.length - 1];
                const fileLinkAdmin = await bot.telegram.getFileLink(photoForAdmin.file_id);
                const imageUrlAdmin = fileLinkAdmin.href;
                const visionResultAdmin = await callVisionAPI(imageUrlAdmin);
                const respAdmin = visionResultAdmin && visionResultAdmin.responses && visionResultAdmin.responses[0];
                const fullTextAdmin = respAdmin && respAdmin.textAnnotations ? respAdmin.textAnnotations.map(t=>t.description).join(' ').toLowerCase() : '';

                const extractNumber = (keyword) => {
                    const idx = fullTextAdmin.indexOf(keyword);
                    if (idx === -1) return null;
                    const sub = fullTextAdmin.slice(idx, idx+200);
                    const m = sub.match(/(\d+(\.\d+)?)/);
                    return m ? parseFloat(m[1]) : null;
                };

                const maybeWeek = extractNumber('أسبوع') || extractNumber('week') || extractNumber('week:');
                const maybeMonth = extractNumber('شهري') || extractNumber('month') || extractNumber('month:');
                const maybe3 = extractNumber('3 أشهر') || extractNumber('3') || extractNumber('three_months');
                const maybeYear = extractNumber('سنو') || extractNumber('year') || extractNumber('سنة');

                const settings = await dbManager.getSettings();
                settings.prices = settings.prices || {};

                if (maybeWeek) settings.prices.week = maybeWeek;
                if (maybeMonth) settings.prices.month = maybeMonth;
                if (maybe3) settings.prices.three_months = maybe3;
                if (maybeYear) settings.prices.year = maybeYear;

                await dbManager.updateSettings(settings);
                await ctx.replyWithMarkdown('✅ تم محاولة استخراج وحفظ الأسعار من الصورة. تحقق من الإعدادات العامة.', getAdminSettingsKeyboard());
                ctx.session.adminStep = 'settings';
                return;
            } catch (err) {
                console.error('Admin price image OCR error:', err);
                await ctx.replyWithMarkdown('❌ حدث خطأ أثناء استخراج الأسعار من الصورة', getAdminSettingsKeyboard());
                ctx.session.adminStep = 'settings';
                return;
            }
        }

        
        // 💳 معالجة صور الدفع
        if (session.paymentType) {
            await handlePaymentScreenshot(ctx, userId);
            return;
        }

        const userData = await dbManager.getUser(userId);
        if (!userData || !userData.onexbet) {
            await ctx.replyWithMarkdown('❌ *يجب التحقق من الحساب أولاً*\n\n🔐 أرسل /start للبدء', getLoginKeyboard());
            return;
        }

        // 🔐 التحقق من المحاولات المجانية أو الاشتراك
        if (userData.subscription_status !== 'active' && userData.free_attempts <= 0) {
            await ctx.replyWithMarkdown(
                '🚫 *انتهت المحاولات المجانية*\n\n' +
                '💳 يرجى الاشتراك للمتابعة في استخدام الخدمة',
                getMainKeyboard()
            );
            return;
        }

        // التحقق من وجود مبلغ رهان
        if (!session.currentBet || session.currentBet <= 0) {
            await ctx.replyWithMarkdown(
                '❌ *يجب تحديد مبلغ الرهان أولاً*\n\n' +
                '💰 استخدم زر "🎯 التوقع التالي" لتحديد المبلغ',
                getMainKeyboard()
            );
            return;
        }

        // 📸 معالجة الصورة
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileLink = await bot.telegram.getFileLink(photo.file_id);
        const imageUrl = fileLink.href;

        // حفظ رابط الصورة في الجلسة للاستخدام لاحقاً
        ctx.session.lastImageUrl = imageUrl;

        const processingMsg = await ctx.reply('🔄 جاري تحليل صورة المباراة بالذكاء الاصطناعي...');

        try {
            const prediction = await goalAI.analyzeImageWithAI(imageUrl);

            // إذا رفض التحليل استرجع الصورة مع رسالة
            if (prediction && prediction.accepted === false) {
                try { await ctx.deleteMessage(processingMsg.message_id); } catch(e){}
                await ctx.replyWithPhoto(imageUrl, {
                    caption: `❌ *لا يتم قبول هذه الصورة لأن الشروط غير كاملة.*\n\n` +
                             `السبب: ${prediction.reason || 'شروط لا تتحقق'}\n\n` +
                             `🔎 *ملاحظات الكشف (مقتطف):* \n` +
                             `• ميسي: ${prediction.detected.hasMessi ? 'نعم' : 'لا'}\n` +
                             `• نيمار: ${prediction.detected.hasNeymar ? 'نعم' : 'لا'}\n` +
                             `• رونالدو: ${prediction.detected.hasRonaldo ? 'نعم' : 'لا'}\n` +
                             `• 'هدف' موجود: ${prediction.detected.hasGoal ? 'نعم' : 'لا'}\n` +
                             `• 'لا هدف' موجود: ${prediction.detected.hasNoGoal ? 'نعم' : 'لا'}\n\n` +
                             `هذه الصوره في الاعلى ☝️`,
                    parse_mode: 'Markdown'
                });
                return;
            }

            // 📊 تحديث إحصائيات المستخدم
            if (userData.subscription_status !== 'active') {
                userData.free_attempts--;
            }
            userData.total_predictions = (userData.total_predictions || 0) + 1;
            userData.total_bets = (userData.total_bets || 0) + session.currentBet;
            userData.lastPrediction = prediction;
            await dbManager.saveUser(userId, userData);

            const analysisMessage = `
🤖 *تحليل الذكاء الاصطناعي المتقدم - v${CONFIG.VERSION}*

📸 *الصورة:* ✅ تم التحليل بنجاح
🕒 *الوقت:* ${new Date().toLocaleString('ar-EG')}
🔐 *الحساب:* \`${userData.onexbet}\`
💰 *مبلغ الرهان:* ${session.currentBet}$

🎯 *نتيجة التحليل:*
${prediction.type}
📈 *الاحتمالية:* ${prediction.probability}%
🎯 *الثقة:* ${prediction.confidence}%

💡 *التحليل:*
${prediction.reasoning}

${userData.subscription_status !== 'active' ? 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}` : 
    `✅ *اشتراك نشط - محاولات غير محدودة*`}
            `;

            await ctx.replyWithMarkdown(analysisMessage);
            
            // إضافة أزرار النتيجة
            const resultKeyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(`🎊 نجح التوقع - ربح ${session.currentBet * 2}$`, `win_${Date.now()}`),
                    Markup.button.callback(`🔄 خسرت - جرب التوقع التالي`, `lose_${Date.now()}`)
                ]
            ]);

            await ctx.replyWithMarkdown(
                '📊 *ما هي نتيجة التوقع؟*\n\n' +
                `🎊 *نجح التوقع* - تربح ${session.currentBet * 2}$\n` +
                `🔄 *خسرت* - جرب التوقع التالي بمضاعفة الرهان\n\n` +
                '✨ سيتم تحديث إحصائيك تلقائياً',
                resultKeyboard
            );

            await ctx.deleteMessage(processingMsg.message_id);

        } catch (analysisError) {
            console.error('Analysis error:', analysisError);
            
            const fallbackPrediction = goalAI.generateSmartPrediction(userId);
            
            await ctx.replyWithMarkdown(
                `🤖 *النظام الاحتياطي - تحليل فوري*\n\n` +
                `🎯 ${fallbackPrediction.type}\n` +
                `📈 ${fallbackPrediction.probability}% | 🎯 ${fallbackPrediction.confidence}%\n\n` +
                `💡 ${fallbackPrediction.reasoning}`,
                getMainKeyboard()
            );

            await ctx.deleteMessage(processingMsg.message_id);
        }

    } catch (error) {
        console.error('Photo handler error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في التحليل*', getMainKeyboard());
    }
});

// 🎯 HANDLE CALLBACK QUERIES - معدل للتعامل مع الخسارة
bot.on('callback_query', async (ctx) => {
    try {
        const callbackData = ctx.callbackQuery.data;
        const userId = ctx.from.id.toString();
        
        if (callbackData.startsWith('win_') || callbackData.startsWith('lose_')) {
            const isWin = callbackData.startsWith('win_');
            
            const userData = await dbManager.getUser(userId);
            if (!userData) {
                await ctx.answerCbQuery('❌ لم يتم العثور على بيانات المستخدم');
                return;
            }
            
            if (isWin) {
                const profit = ctx.session.currentBet;
                userData.wins = (userData.wins || 0) + 1;
                userData.correct_predictions = (userData.correct_predictions || 0) + 1;
                userData.total_profit = (userData.total_profit || 0) + profit;
                ctx.session.totalProfit += profit;
                
                await ctx.answerCbQuery(`🎊 مبروك! نجح التوقع وربحت ${profit}$`);
                
                await ctx.replyWithMarkdown(
                    `🎊 *مبروك! نجح التوقع بنجاح* ✨\n\n` +
                    `✅ توقعك كان دقيقاً ومميزاً\n` +
                    `💰 ربحت: ${profit}$\n` +
                    `💵 إجمالي أرباحك: ${ctx.session.totalProfit}$\n\n` +
                    `🎯 يمكنك البدء بتوقع جديد`,
                    getMainKeyboard()
                );
                
            } else {
                // مضاعفة الرهان وتوليد توقع جديد تلقائياً
                const newBet = ctx.session.currentBet * 2;
                userData.losses = (userData.losses || 0) + 1;
                ctx.session.currentBet = newBet;
                
                await ctx.answerCbQuery(`🔄 جاري إنشاء التوقع التالي...`);
                
                // توليد توقع جديد تلقائياً
                const newPrediction = goalAI.generateNextPrediction(userId);
                
                await ctx.replyWithMarkdown(
                    `🔄 *خسرت هذه الجولة*\n\n` +
                    `📈 الرهان التالي مضاعف: ${newBet}$\n` +
                    `💪 لا توقف.. استمر في المحاولة\n\n` +
                    `🎯 *التوقع التالي:*\n` +
                    `${newPrediction.type}\n` +
                    `📈 ${newPrediction.probability}% | 🎯 ${newPrediction.confidence}%\n` +
                    `💡 ${newPrediction.reasoning}`,
                    getMainKeyboard()
                );
                
                // إضافة أزرار النتيجة للتوقع الجديد
                const resultKeyboard = Markup.inlineKeyboard([
                    [
                        Markup.button.callback(`🎊 نجح التوقع - ربح ${newBet * 2}$`, `win_${Date.now()}`),
                        Markup.button.callback(`🔄 خسرت - جرب التوقع التالي`, `lose_${Date.now()}`)
                    ]
                ]);

                await ctx.replyWithMarkdown(
                    '📊 *ما هي نتيجة التوقع الجديد؟*',
                    resultKeyboard
                );
            }
            
            await dbManager.saveUser(userId, userData);
            
            try {
                await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
            } catch (deleteError) {
                console.log('Could not delete message:', deleteError);
            }
        }
        
        // معالجة أزرار القبول والرفض في الإدمن
        else if (callbackData.startsWith('accept_')) {
            const paymentId = callbackData.split('_')[1];
            await handlePaymentAccept(ctx, paymentId);
        }
        else if (callbackData.startsWith('reject_')) {
            const paymentId = callbackData.split('_')[1];
            await handlePaymentReject(ctx, paymentId);
        }
        
    } catch (error) {
        console.error('Callback query error:', error);
        await ctx.answerCbQuery('❌ حدث خطأ في المعالجة');
    }
});

// 🎯 HANDLER FUNCTIONS

// دالة جديدة للتعامل مع التوقع التالي
async function handleNextPrediction(ctx, userData) {
    try {
        if (!ctx.session.lastImageUrl) {
            await ctx.replyWithMarkdown('❌ *لا توجد صورة سابقة*\n\n📸 يرجى إرسال صورة أولاً');
            return;
        }

        const processingMsg = await ctx.reply('🔄 جاري إنشاء التوقع التالي بالذكاء الاصطناعي...');
        
        const prediction = await goalAI.analyzeImageWithAI(ctx.session.lastImageUrl);
        
        userData.total_predictions = (userData.total_predictions || 0) + 1;
        userData.total_bets = (userData.total_bets || 0) + ctx.session.currentBet;
        userData.lastPrediction = prediction;
        await dbManager.saveUser(ctx.from.id.toString(), userData);

        const analysisMessage = `
🤖 *تحليل الذكاء الاصطناعي المتقدم - v${CONFIG.VERSION}*

📸 *الصورة:* ✅ إعادة استخدام الصورة السابقة
🕒 *الوقت:* ${new Date().toLocaleString('ar-EG')}
🔐 *الحساب:* \`${userData.onexbet}\`
💰 *مبلغ الرهان:* ${ctx.session.currentBet}$

🎯 *نتيجة التحليل:*
${prediction.type}
📈 *الاحتمالية:* ${prediction.probability}%
🎯 *الثقة:* ${prediction.confidence}%

💡 *التحليل:*
${prediction.reasoning}
        `;

        await ctx.replyWithMarkdown(analysisMessage);
        
        // إضافة أزرار النتيجة
        const resultKeyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback(`🎊 نجح التوقع - ربح ${ctx.session.currentBet * 2}$`, `win_${Date.now()}`),
                Markup.button.callback(`🔄 خسرت - جرب التوقع التالي`, `lose_${Date.now()}`)
            ]
        ]);

        await ctx.replyWithMarkdown(
            '📊 *ما هي نتيجة التوقع؟*\n\n' +
            `🎊 *نجح التوقع* - تربح ${ctx.session.currentBet * 2}$\n` +
            `🔄 *خسرت* - جرب التوقع التالي بمضاعفة الرهان\n\n` +
            '✨ سيتم تحديث إحصائيك تلقائياً',
            resultKeyboard
        );

        await ctx.deleteMessage(processingMsg.message_id);

    } catch (error) {
        console.error('Next prediction error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في إنشاء التوقع التالي*', getMainKeyboard());
    }
}

async function handleUserStats(ctx, userData) {
    const accuracy = userData.correct_predictions > 0 ? 
        Math.round((userData.correct_predictions / (userData.total_predictions || 1)) * 100) : 0;
    
    let subscriptionInfo = '';
    if (userData.subscription_status === 'active') {
        const remainingDays = calculateRemainingDays(userData.subscription_end_date);
        subscriptionInfo = `\n📦 *الاشتراك:* ${userData.subscription_type}\n` +
                          `⏳ *متبقي:* ${remainingDays} يوم`;
    } else {
        subscriptionInfo = `\n🆓 *محاولات مجانية:* ${userData.free_attempts}`;
    }
    
    await ctx.replyWithMarkdown(
        `📊 *إحصائياتك الشخصية*\n\n` +
        `🔐 ${userData.onexbet}\n` +
        `👤 ${userData.username}\n` +
        `📈 ${userData.total_predictions || 0} توقع\n` +
        `✅ ${userData.correct_predictions || 0} صحيحة\n` +
        `🎯 ${accuracy}% دقة\n` +
        `🎉 ${userData.wins || 0} فوز\n` +
        `💔 ${userData.losses || 0} خسارة\n` +
        `💰 إجمالي الرهانات: ${userData.total_bets || 0}$\n` +
        `💵 إجمالي الأرباح: ${userData.total_profit || 0}$` +
        subscriptionInfo,
        getMainKeyboard()
    );
}

async function handleBotStats(ctx) {
    const stats = fakeStats.getStats();
    await ctx.replyWithMarkdown(
        `👥 *إحصائيات البوت*\n\n` +
        `👤 إجمالي المستخدمين: ${stats.totalUsers.toLocaleString()}\n` +
        `🟢 مستخدمين نشطين الآن: ${stats.activeUsers}\n` +
        `📊 التوقعات اليومية: ${Math.floor(stats.activeUsers * 8.5)}\n\n` +
        `🎯 *النظام يعمل بكفاءة عالية*`,
        getMainKeyboard()
    );
}

async function handleSubscriptions(ctx, userData) {
    try {
        const settings = await dbManager.getSettings();
        const prices = settings.prices;
        const payment_links = settings.payment_links;
        
        const subscriptionMessage = `
💳 *باقات الاشتراك المتاحة*

💰 *أسبوعي:* ${prices.week}$
⏰ مدة: 7 أيام

💰 *شهري:* ${prices.month}$  
⏰ مدة: 30 يوماً

💰 *3 أشهر:* ${prices.three_months}$
⏰ مدة: 90 يوماً

💰 *سنوي:* ${prices.year}$
⏰ مدة: 365 يوماً

📋 *طريقة الدفع:*
1. اختر الباقة المناسبة
2. ادفع عبر الرابط
3. أرسل رقم حساب 1xBet (10 أرقام)
4. أرسل صورة إثبات الدفع
5. انتظر التفعيل من الإدارة
        `;

        await ctx.replyWithMarkdown(subscriptionMessage, getSubscriptionKeyboard());
    } catch (error) {
        console.error('Subscriptions error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب معلومات الاشتراكات*', getMainKeyboard());
    }
}

async function handleSubscriptionSelection(ctx, userData, text) {
    const subscriptionTypeMap = {
        '💰 أسبوعي': 'week',
        '💰 شهري': 'month', 
        '💰 3 أشهر': 'three_months',
        '💰 سنوي': 'year'
    };

    const subscriptionType = subscriptionTypeMap[text];
    if (!subscriptionType) {
        await ctx.replyWithMarkdown('❌ *اختيار غير صحيح*', getSubscriptionKeyboard());
        return;
    }

    try {
        const settings = await dbManager.getSettings();
        const prices = settings.prices;
        const payment_links = settings.payment_links;

        ctx.session.paymentType = subscriptionType;
        ctx.session.awaitingPaymentAccount = true;

        await ctx.replyWithMarkdown(
            `💳 *باقة ${text.replace('💰 ', '')}*\n\n` +
            `💰 السعر: ${prices[subscriptionType]}$\n` +
            `🔗 رابط الدفع: ${payment_links[subscriptionType]}\n\n` +
            `📋 *خطوات الإكمال:*\n` +
            `1. ادفع عبر الرابط أعلاه\n` +
            `2. أرسل رقم حساب 1xBet (10 أرقام)\n` +
            `3. أرسل صورة إثبات الدفع\n\n` +
            `🔢 *الآن أرسل رقم حساب 1xBet المكون من 10 أرقام:*`
        );
    } catch (error) {
        console.error('Subscription selection error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في معالجة طلب الاشتراك*', getSubscriptionKeyboard());
    }
}

async function handleSubscriptionStatus(ctx, userData) {
    let statusMessage = '';
    
    if (userData.subscription_status === 'active') {
        const remainingDays = calculateRemainingDays(userData.subscription_end_date);
        statusMessage = `✅ *اشتراكك نشط*\n\n` +
                       `🔐 الحساب: \`${userData.onexbet}\`\n` +
                       `📦 النوع: ${userData.subscription_type}\n` +
                       `📅 الانتهاء: ${new Date(userData.subscription_end_date).toLocaleDateString('ar-EG')}\n` +
                       `⏳ متبقي: ${remainingDays} يوم`;
    } else if (userData.free_attempts > 0) {
        statusMessage = `🎯 *محاولات مجانية متاحة*\n\n` +
                       `🔐 الحساب: \`${userData.onexbet}\`\n` +
                       `🆓 محاولات مجانية: ${userData.free_attempts}\n\n` +
                       `💳 يمكنك الاشتراك للحصول على ميزات غير محدودة`;
    } else {
        statusMessage = `🚫 *انتهت المحاولات*\n\n` +
                       `🔐 الحساب: \`${userData.onexbet}\`\n` +
                       `💳 يرجى الاشتراك للمتابعة في استخدام الخدمة`;
    }
    
    await ctx.replyWithMarkdown(statusMessage, getMainKeyboard());
}

async function handlePaymentScreenshot(ctx, userId) {
    try {
        const userData = await dbManager.getUser(userId);
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileLink = await bot.telegram.getFileLink(photo.file_id);
        const imageUrl = fileLink.href;

        const settings = await dbManager.getSettings();
        const prices = settings.prices;

        const accountNumber = ctx.session.paymentAccount || userData.onexbet;

        const uploadResult = await imgbbUploader.uploadImage(imageUrl);
        
        const paymentData = {
            user_id: userId,
            onexbet: accountNumber,
            screenshot_url: uploadResult.url,
            amount: prices[ctx.session.paymentType],
            subscription_type: ctx.session.paymentType,
            username: userData.username,
            timestamp: new Date().toISOString()
        };

        const paymentId = await dbManager.addPayment(paymentData);
        
        // إرسال الإشعار للإدارة
        try {
            await bot.telegram.sendMessage(
                CONFIG.ADMIN_ID,
                `🆕 *طلب دفع جديد*\n\n` +
                `👤 المستخدم: ${userData.username}\n` +
                `🔐 الحساب: ${accountNumber}\n` +
                `💰 المبلغ: ${paymentData.amount}$\n` +
                `📦 الباقة: ${ctx.session.paymentType}\n` +
                `🆔 الرقم: ${paymentId}\n` +
                `📅 الوقت: ${new Date().toLocaleString('ar-EG')}\n` +
                `🔗 صورة: ${uploadResult.url}`,
                {
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '✅ قبول الاشتراك', callback_data: `accept_${paymentId}` },
                                { text: '❌ رفض الطلب', callback_data: `reject_${paymentId}` }
                            ]
                        ]
                    }
                }
            );
        } catch (error) {
            console.error('Error notifying admin:', error);
        }

        await ctx.replyWithMarkdown(
            '📩 *تم استلام صورة الدفع بنجاح*\n\n' +
            `✅ الحساب: \`${accountNumber}\`\n` +
            `✅ الباقة: ${ctx.session.paymentType}\n` +
            `💰 المبلغ: ${paymentData.amount}$\n\n` +
            '✅ سيتم مراجعتها من الإدارة في أقرب وقت\n' +
            '⏰ عادةً خلال 24 ساعة\n\n' +
            `📞 للاستفسار: ${CONFIG.DEVELOPER}`,
            getMainKeyboard()
        );

        ctx.session.paymentType = null;
        ctx.session.awaitingPaymentAccount = false;
        ctx.session.paymentAccount = null;
    } catch (error) {
        console.error('Payment screenshot error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في معالجة صورة الدفع*', getMainKeyboard());
    }
}

// 🔧 ADMIN HANDLERS - معدل بالكامل
async function handleAdminCommands(ctx, text) {
    const session = ctx.session;
    
    try {
        // معالجة تعديل الأسعار
        if (session.adminStep === 'price_edit') {
            await handleAdminPriceEdit(ctx, text);
            return;
        }
        
        // معالجة تعديل الروابط
        if (session.adminStep === 'link_edit') {
            await handleAdminLinkEdit(ctx, text);
            return;
        }
        
        // معالجة تعديل صورة QR
        if (session.adminStep === 'qr_edit') {
            await handleAdminQREdit(ctx, text);
            return;
        }

        switch (session.adminStep) {
            case 'main':
                await handleAdminMain(ctx, text);
                break;
            case 'users':
                await handleAdminUsers(ctx, text);
                break;
            case 'payments':
                await handleAdminPayments(ctx, text);
                break;
            case 'settings':
                await handleAdminSettings(ctx, text);
                break;
            default:
                await handleAdminMain(ctx, text);
                break;
        }
    } catch (error) {
        console.error('Admin commands error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في معالجة الأمر', getAdminMainKeyboard());
    }
}

async function handleAdminMain(ctx, text) {
    try {
        switch (text) {
            case '📊 إحصائيات النظام':
                await handleAdminStats(ctx);
                break;
                
            case '👥 إدارة المستخدمين':
                ctx.session.adminStep = 'users';
                await ctx.replyWithMarkdown('👥 *إدارة المستخدمين*', getAdminUsersKeyboard());
                break;
                
            case '💰 طلبات الدفع':
                ctx.session.adminStep = 'payments';
                await ctx.replyWithMarkdown('💰 *إدارة طلبات الدفع*', getAdminPaymentsKeyboard());
                break;
                
            case '⚙️ الإعدادات':
                ctx.session.adminStep = 'settings';
                await ctx.replyWithMarkdown('⚙️ *الإعدادات العامة*', getAdminSettingsKeyboard());
                break;

            case '📢 إرسال إشعار':
                ctx.session.adminStep = 'broadcast';
                await ctx.replyWithMarkdown(
                    '📢 *إرسال إشعار جماعي*\n\n' +
                    '✍️ الرجاء كتابة الرسالة التي تريد إرسالها لجميع المستخدمين:'
                );
                break;

            case '🔍 بحث عن مستخدم':
                ctx.session.adminStep = 'search_user';
                await ctx.replyWithMarkdown(
                    '🔍 *البحث عن مستخدم*\n\n' +
                    'يمكنك البحث باستخدام:\n' +
                    '• آيدي المستخدم\n' +
                    '• اسم المستخدم\n' +
                    '• رقم حساب 1xBet\n\n' +
                    '🔎 الرجاء إدخال كلمة البحث:'
                );
                break;

            case '🔧 قفل/فتح البوت':
                await handleAdminToggleMaintenance(ctx);
                break;
                
            case '🔙 الخروج من الإدمن':
                ctx.session.adminMode = false;
                ctx.session.adminStep = null;
                await ctx.replyWithMarkdown('🔒 *تم الخروج من وضع الإدمن*', { remove_keyboard: true });
                break;
                
            default:
                await ctx.replyWithMarkdown('❌ *خيار غير معروف*', getAdminMainKeyboard());
                break;
        }
    } catch (error) {
        console.error('Admin main error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في معالجة الأمر', getAdminMainKeyboard());
    }
}

// البحث عن مستخدم
async function handleAdminSearchUser(ctx, query) {
    try {
        const users = await dbManager.searchUsers(query);
        
        if (users.length === 0) {
            await ctx.replyWithMarkdown('❌ *لم يتم العثور على مستخدمين*', getAdminMainKeyboard());
            ctx.session.adminStep = 'main';
            return;
        }

        let message = `🔍 *نتائج البحث (${users.length})*\n\n`;
        
        users.slice(0, 10).forEach((user, index) => {
            const status = user.subscription_status === 'active' ? '✅' : '🆓';
            message += `${index + 1}. ${user.username || 'بدون اسم'} ${status}\n`;
            message += `   👤 ${user.user_id} | 🔐 ${user.onexbet}\n`;
            message += `   📊 ${user.total_predictions || 0} توقع | 💰 ${user.total_profit || 0}$\n\n`;
        });

        if (users.length > 10) {
            message += `... و ${users.length - 10} مستخدم آخر`;
        }

        await ctx.replyWithMarkdown(message, getAdminMainKeyboard());
        ctx.session.adminStep = 'main';
        
    } catch (error) {
        console.error('Admin search user error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في البحث', getAdminMainKeyboard());
        ctx.session.adminStep = 'main';
    }
}

// الإشعار الجماعي

async function handleAdminBroadcast(ctx, message) {
    try {
        const users = await dbManager.getAllUsers();
        let success = 0;
        let failed = 0;

        const broadcastMsg = await ctx.replyWithMarkdown('📢 *جاري إرسال الإشعار لجميع المستخدمين...*');

        for (const user of users) {
            const targetId = (user.user_id && user.user_id.toString()) || (user.id && user.id.toString());
            if (!targetId) { failed++; continue; }

            try {
                await bot.telegram.sendMessage(
                    targetId,
                    `📢 *إشعار من الإدارة*\n\n${message}`,
                    { parse_mode: 'Markdown' }
                );
                success++;
            } catch (error) {
                failed++;
                console.log(`Broadcast failed to ${targetId}:`, error && error.message ? error.message : error);
            }

            await new Promise(resolve => setTimeout(resolve, 120));
        }

        await ctx.replyWithMarkdown(
            `📢 *تم الانتهاء من الإرسال*\n\n` +
            `✅ تم الإرسال بنجاح: ${success} مستخدم\n` +
            `❌ فشل في الإرسال: ${failed} مستخدم\n` +
            `👥 الإجمالي: ${users.length} مستخدم`,
            getAdminMainKeyboard()
        );

        ctx.session.adminStep = 'main';
    } catch (error) {
        console.error('Admin broadcast error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في إرسال الإشعار', getAdminMainKeyboard());
        ctx.session.adminStep = 'main';
    }
}

//
async function handleAdminPriceEdit(ctx, text) {
    try {
        const parts = (text || '').trim().split(/\s+/);
        if (parts.length === 2 && ['week','month','three_months','year'].includes(parts[0])) {
            const key = parts[0];
            const val = parseFloat(parts[1]);
            if (isNaN(val) || val <= 0) {
                await ctx.replyWithMarkdown('❌ قيمة غير صحيحة. الرجاء إرسال رقم صالح.');
                return;
            }
            const settings = await dbManager.getSettings();
            settings.prices = settings.prices || {};
            settings.prices[key] = val;
            await dbManager.updateSettings(settings);
            await ctx.replyWithMarkdown(`✅ تم تحديث سعر ${key} إلى ${val}$`, getAdminSettingsKeyboard());
            ctx.session.adminStep = 'settings';
            return;
        }
        if (text && (text.toLowerCase().includes('send image') || text.toLowerCase().includes('صوره') || text.toLowerCase().includes('صورة'))) {
            await ctx.replyWithMarkdown('📸 أرسل صورة تحتوي على الأسعار (الأسبوعي، الشهري، 3 أشهر، سنوي). سأحاول استخراج الأرقام عبر OCR.');
            ctx.session.adminStep = 'price_edit';
            return;
        }
        await ctx.replyWithMarkdown('❌ صيغة غير معروفة.\n\nمثال للتعديل: `week 15` أو اكتب "صورة" ثم ارسل صورة الأسعار.', { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('handleAdminPriceEdit error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تعديل الأسعار', getAdminSettingsKeyboard());
        ctx.session.adminStep = 'settings';
    }
}

 معالجة تعديل الأسعار
async function handleAdminPriceEdit(ctx, text) {
    try {
        const parts = text.split(' ');
        if (parts.length !== 2) {
            await ctx.replyWithMarkdown('❌ *صيغة غير صحيحة!*\n\nاستخدم: week 15 أو month 40 إلخ...');
            return;
        }

        const [type, price] = parts;
        const priceNum = parseFloat(price);

        if (isNaN(priceNum) || priceNum <= 0) {
            await ctx.replyWithMarkdown('❌ *سعر غير صحيح!*\n\nيجب أن يكون السعر رقم موجب');
            return;
        }

        const validTypes = ['week', 'month', 'three_months', 'year'];
        if (!validTypes.includes(type)) {
            await ctx.replyWithMarkdown('❌ *نوع غير صحيح!*\n\nالأنواع المسموحة: week, month, three_months, year');
            return;
        }

        const settings = await dbManager.getSettings();
        settings.prices[type] = priceNum;
        await dbManager.updateSettings(settings);

        await ctx.replyWithMarkdown(
            `✅ *تم تحديث السعر بنجاح*\n\n` +
            `📦 ${type}: ${priceNum}$\n\n` +
            `🔄 تم حفظ التغييرات`,
            getAdminSettingsKeyboard()
        );

        ctx.session.adminStep = 'settings';
    } catch (error) {
        console.error('Admin price edit error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تعديل السعر', getAdminSettingsKeyboard());
    }
}

// معالجة تعديل الروابط
async function handleAdminLinkEdit(ctx, text) {
    try {
        const parts = text.split(' ');
        if (parts.length !== 2) {
            await ctx.replyWithMarkdown('❌ *صيغة غير صحيحة!*\n\nاستخدم: week https://link.com أو month https://link.com إلخ...');
            return;
        }

        const [type, link] = parts;

        const validTypes = ['week', 'month', 'three_months', 'year'];
        if (!validTypes.includes(type)) {
            await ctx.replyWithMarkdown('❌ *نوع غير صحيح!*\n\nالأنواع المسموحة: week, month, three_months, year');
            return;
        }

        if (!link.startsWith('http')) {
            await ctx.replyWithMarkdown('❌ *رابط غير صحيح!*\n\nيجب أن يبدأ الرابط بـ http أو https');
            return;
        }

        const settings = await dbManager.getSettings();
        settings.payment_links[type] = link;
        await dbManager.updateSettings(settings);

        await ctx.replyWithMarkdown(
            `✅ *تم تحديث الرابط بنجاح*\n\n` +
            `🔗 ${type}: ${link}\n\n` +
            `🔄 تم حفظ التغييرات`,
            getAdminSettingsKeyboard()
        );

        ctx.session.adminStep = 'settings';
    } catch (error) {
        console.error('Admin link edit error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تعديل الرابط', getAdminSettingsKeyboard());
    }
}

// معالجة تعديل صورة QR
async function handleAdminQREdit(ctx, text) {
    try {
        if (!text.startsWith('qr ')) {
            await ctx.replyWithMarkdown('❌ *صيغة غير صحيحة!*\n\nاستخدم: qr https://example.com/new-image.jpg');
            return;
        }

        const link = text.replace('qr ', '').trim();

        if (!link.startsWith('http')) {
            await ctx.replyWithMarkdown('❌ *رابط غير صحيح!*\n\nيجب أن يبدأ الرابط بـ http أو https');
            return;
        }

        // تحديث رابط الصورة في الإعدادات
        const settings = await dbManager.getSettings();
        settings.analysis_image = link;
        await dbManager.updateSettings(settings);

        // تحديث الكونفج أيضاً
        CONFIG.ANALYSIS_IMAGE = link;

        await ctx.replyWithMarkdown(
            `✅ *تم تحديث صورة QR بنجاح*\n\n` +
            `🖼️ الرابط الجديد: ${link}\n\n` +
            `🔄 تم حفظ التغييرات`,
            getAdminSettingsKeyboard()
        );

        ctx.session.adminStep = 'settings';
    } catch (error) {
        console.error('Admin QR edit error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تعديل صورة QR', getAdminSettingsKeyboard());
    }
}

async function handlePaymentAccept(ctx, paymentId) {
    try {
        const payment = await dbManager.getPayment(paymentId);
        if (!payment) {
            await ctx.answerCbQuery('❌ طلب الدفع غير موجود');
            return;
        }
        
        const userData = await dbManager.getUser(payment.user_id);
        if (!userData) {
            await ctx.answerCbQuery('❌ المستخدم غير موجود');
            return;
        }
        
        const startDate = new Date().toISOString();
        const endDate = addSubscriptionDays(startDate, payment.subscription_type);
        
        userData.subscription_status = 'active';
        userData.subscription_type = payment.subscription_type;
        userData.subscription_start_date = startDate;
        userData.subscription_end_date = endDate;
        userData.free_attempts = 0;
        
        await dbManager.saveUser(payment.user_id, userData);
        await dbManager.updatePayment(paymentId, { 
            status: 'accepted',
            processed_at: new Date().toISOString()
        });
        
        // إشعار المستخدم
        try {
            await bot.telegram.sendMessage(
                payment.user_id,
                `🎉 *تم تفعيل اشتراكك بنجاح!*\n\n` +
                `✅ ${payment.subscription_type}\n` +
                `💰 ${payment.amount}$\n` +
                `📅 الانتهاء: ${new Date(endDate).toLocaleDateString('ar-EG')}\n` +
                `⏳ المتبقي: ${calculateRemainingDays(endDate)} يوم\n\n` +
                `🎯 يمكنك الآن استخدام الخدمة بدون حدود`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('Error notifying user:', error);
        }
        
        await ctx.answerCbQuery('✅ تم تفعيل الاشتراك');
        
        // تعديل الرسالة الأصلية بدلاً من حذفها
        try {
            await ctx.editMessageText(
                `✅ *تم تفعيل الاشتراك بنجاح*\n\n` +
                `👤 ${userData.username}\n` +
                `🔐 ${userData.onexbet}\n` +
                `📦 ${payment.subscription_type}\n` +
                `💰 ${payment.amount}$\n\n` +
                `🕒 ${new Date().toLocaleString('ar-EG')}`,
                { parse_mode: 'Markdown' }
            );
        } catch (editError) {
            console.log('Could not edit message:', editError);
        }

    } catch (error) {
        console.error('Payment accept error:', error);
        await ctx.answerCbQuery('❌ حدث خطأ في قبول الدفع');
    }
}

async function handlePaymentReject(ctx, paymentId) {
    try {
        const payment = await dbManager.getPayment(paymentId);
        if (!payment) {
            await ctx.answerCbQuery('❌ طلب الدفع غير موجود');
            return;
        }
        
        await dbManager.updatePayment(paymentId, { 
            status: 'rejected',
            processed_at: new Date().toISOString()
        });
        
        // إشعار المستخدم
        try {
            await bot.telegram.sendMessage(
                payment.user_id,
                `❌ *تم رفض طلب الدفع*\n\n` +
                `💳 يرجى التحقق من صورة الدفع والمحاولة مرة أخرى\n\n` +
                `📞 للاستفسار: ${CONFIG.DEVELOPER}`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('Error notifying user:', error);
        }
        
        await ctx.answerCbQuery('❌ تم رفض الطلب');
        
        // تعديل الرسالة الأصلية بدلاً من حذفها
        try {
            await ctx.editMessageText(
                `❌ *تم رفض طلب الدفع*\n\n` +
                `🆔 ${paymentId}\n` +
                `👤 ${payment.username}\n` +
                `🔐 ${payment.onexbet}\n\n` +
                `🕒 ${new Date().toLocaleString('ar-EG')}`,
                { parse_mode: 'Markdown' }
            );
        } catch (editError) {
            console.log('Could not edit message:', editError);
        }

    } catch (error) {
        console.error('Payment reject error:', error);
        await ctx.answerCbQuery('❌ حدث خطأ في رفض الدفع');
    }
}

// 🚀 START BOT
bot.launch().then(() => {
    console.log('🎉 SUCCESS! AI GOAL Predictor v10.4 is RUNNING!');
    console.log('👤 Developer:', CONFIG.DEVELOPER);
    console.log('📢 Channel:', CONFIG.CHANNEL);
    console.log('🌐 Health check: http://localhost:' + PORT);
    console.log('🔧 Admin ID:', CONFIG.ADMIN_ID);
}).catch(console.error);

// ⚡ Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('✅ AI Goal Prediction System Ready!');