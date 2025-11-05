// ===================================================
// 🚀 AI GOAL PREDICTOR ULTIMATE - VERSION 9.0
// 👤 DEVELOPER: AMIN - @GEMZGOOLBOT
// 🔥 FEATURES: SMART AI + SUBSCRIPTION SYSTEM + FIREBASE + FULL ADMIN PANEL
// ===================================================

console.log('🤖 Starting AI GOAL Predictor Ultimate v9.0...');
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

    // 🔥 FIREBASE CONFIG
    FIREBASE_CONFIG: {
        apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDYb722t6Oh4waMKW0AO1lRUbaXZJKuTC4",
        authDomain: process.env.FIREBASE_AUTH_DOMAIN || "bot-tlegram-9f4b5.firebaseapp.com",
        databaseURL: process.env.FIREBASE_DATABASE_URL || "https://bot-tlegram-9f4b5-default-rtdb.firebaseio.com",
        projectId: process.env.FIREBASE_PROJECT_ID || "bot-tlegram-9f4b5",
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "bot-tlegram-9f4b5.firebasestorage.app",
        messagingSenderId: process.env.FIREBASE_SENDER_ID || "561534640067",
        appId: process.env.FIREBASE_APP_ID || "1:561534640067:web:7990e0d4be536ae5e66776",
        measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-18FYRTQMT9"
    },
    
    VERSION: "9.0.0",
    DEVELOPER: "AMIN - @GEMZGOOLBOT",
    CHANNEL: "@GEMZGOOL",
    START_IMAGE: "https://i.ibb.co/tMmC9bzy/IMG-20251018-WA0027.jpg"
};

console.log('✅ Configuration loaded successfully');

// 🚀 INITIALIZE BOT
const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');
const express = require('express');

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
    
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: CONFIG.FIREBASE_CONFIG.projectId,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL || `firebase-adminsdk@${CONFIG.FIREBASE_CONFIG.projectId}.iam.gserviceaccount.com`,
                privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
            }),
            databaseURL: CONFIG.FIREBASE_CONFIG.databaseURL
        });
    }
    
    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
} catch (error) {
    console.log('⚠️ Firebase initialization failed, using local storage');
}

// 🗄️ LOCAL STORAGE FALLBACK
const userDatabase = new Map();
const paymentDatabase = new Map();
const settingsDatabase = new Map();

// 📊 FAKE STATISTICS SYSTEM
class FakeStatistics {
    constructor() {
        this.totalUsers = 78542;
        this.activeUsers = 287;
        this.lastUpdate = Date.now();
        this.updateInterval = 3 * 60 * 1000; // Update every 3 minutes
    }

    getStats() {
        const now = Date.now();
        if (now - this.lastUpdate > this.updateInterval) {
            this.updateStats();
            this.lastUpdate = now;
        }
        return {
            totalUsers: this.totalUsers,
            activeUsers: this.activeUsers
        };
    }

    updateStats() {
        // تغيير عشوائي في عدد المستخدمين النشطين
        const change = Math.floor(Math.random() * 41) - 20; // -20 إلى +20
        this.activeUsers = Math.max(150, Math.min(350, this.activeUsers + change));
        
        // زيادة بطيئة في إجمالي المستخدمين
        if (Math.random() > 0.7) {
            this.totalUsers += Math.floor(Math.random() * 10) + 1;
        }
    }

    incrementActiveUsers() {
        this.activeUsers = Math.min(350, this.activeUsers + 1);
    }

    decrementActiveUsers() {
        this.activeUsers = Math.max(150, this.activeUsers - 1);
    }
}

// 🧠 SMART GOAL PREDICTION ENGINE
class GoalPredictionAI {
    constructor() {
        this.predictionHistory = new Map();
        this.algorithmVersion = "9.0";
        this.lastPredictionTime = new Map();
    }

    generateSmartPrediction(userId, matchContext = {}) {
        const userHistory = this.predictionHistory.get(userId) || [];
        const basePrediction = this.calculateBasePrediction(matchContext);
        
        const timeFactor = this.calculateTimeFactor(matchContext.time);
        const pressureFactor = this.calculatePressureFactor(matchContext);
        const historyFactor = this.calculateHistoryFactor(userHistory);
        const randomFactor = Math.random() * 0.3 - 0.15;
        
        let finalProbability = basePrediction.probability + timeFactor + pressureFactor + historyFactor + randomFactor;
        finalProbability = Math.max(25, Math.min(85, finalProbability));
        const isGoal = finalProbability > 65;
        
        const prediction = {
            type: isGoal ? '⚽ GOAL' : '❌ NO GOAL',
            probability: Math.round(finalProbability),
            confidence: 100, // دائماً 100% ثقة
            reasoning: this.generateReasoning(isGoal, matchContext, finalProbability),
            factors: {
                time: matchContext.time,
                pressure: Math.round(pressureFactor),
                history: Math.round(historyFactor),
                random: Math.round(randomFactor * 100) / 100
            },
            timestamp: new Date().toISOString(),
            algorithm: this.algorithmVersion,
            isWin: null // سيتم تعيينه لاحقاً
        };

        userHistory.push(prediction);
        if (userHistory.length > 10) userHistory.shift();
        this.predictionHistory.set(userId, userHistory);
        this.lastPredictionTime.set(userId, Date.now());

        return prediction;
    }

    calculateBasePrediction(context) {
        let baseProb = 50;
        if (context.time > 75) baseProb += 15;
        if (context.time < 15) baseProb -= 10;
        if (context.score) {
            const [home, away] = context.score.split('-').map(Number);
            const diff = Math.abs(home - away);
            if (diff <= 1) baseProb += 10;
        }
        return { probability: baseProb };
    }

    calculateTimeFactor(minute) {
        if (!minute) return 0;
        if (minute >= 80) return 12;
        if (minute >= 60) return 8;
        if (minute >= 30) return 5;
        return 0;
    }

    calculatePressureFactor(context) {
        let pressure = 0;
        if (context.attacks > 10) pressure += 8;
        if (context.shotsOnTarget > 3) pressure += 10;
        if (context.corners > 2) pressure += 6;
        if (context.possession > 60) pressure += 7;
        return pressure;
    }

    calculateHistoryFactor(history) {
        if (history.length === 0) return 0;
        const recentGoals = history.slice(-3).filter(p => p.type === '⚽ GOAL').length;
        if (recentGoals >= 2) return 8;
        if (recentGoals === 0) return -5;
        return 0;
    }

    generateReasoning(isGoal, context, probability) {
        const reasons = {
            goal: [
                `الضغط الهجومي المستمر عند الدقيقة ${context.time || 'متقدمة'} يشير لهدف قريب بنسبة 100%`,
                `التسديدات المتتالية على المرمى تزيد فرص التسجيل بشكل ملحوظ بنسبة 100%`,
                `الركنيات المتكررة تشكل تهديداً مستمراً على دفاع الخصم بنسبة 100%`,
                `الاستحواذ الكبير في منتصف الملعب يخلق فرصاً واضحة بنسبة 100%`,
                `لعب الكرات الطويلة والعارضات يضاعف من فرص التسجيل بنسبة 100%`
            ],
            noGoal: [
                `الدفاع المنظم في الدقيقة ${context.time || 'الحالية'} يحد من الفرص بنسبة 100%`,
                `انخفاض وتيرة الهجمات يقلل من فرص التسجيل حالياً بنسبة 100%`,
                `اللعب في منتصف الملعب يحافظ على التوازن الدفاعي بنسبة 100%`,
                `غياب الضغط الهجومي المستمر يحد من خطورة المنطقة بنسبة 100%`,
                `التحول الدفاعي القوي يجعل التسجيل صعباً في هذه اللحظة بنسبة 100%`
            ]
        };
        const category = isGoal ? 'goal' : 'noGoal';
        return reasons[category][Math.floor(Math.random() * reasons[category].length)];
    }

    generateNextPrediction(userId) {
        const context = this.generateRandomMatchContext();
        return this.generateSmartPrediction(userId, context);
    }

    generateRandomMatchContext() {
        const currentMinute = Math.floor(Math.random() * 90) + 1;
        return {
            time: currentMinute,
            score: `${Math.floor(Math.random() * 3)}-${Math.floor(Math.random() * 3)}`,
            attacks: Math.floor(Math.random() * 15) + 5,
            shotsOnTarget: Math.floor(Math.random() * 6) + 1,
            corners: Math.floor(Math.random() * 5) + 1,
            possession: Math.floor(Math.random() * 40) + 30,
            momentum: ['HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 3)]
        };
    }

    async analyzeImageWithAI(imageUrl) {
        try {
            console.log('🔄 استخدام الذكاء الاصطناعي المتقدم لتحليل الصورة...');
            // محاكاة تحليل الذكاء الاصطناعي مع تأخير
            await new Promise(resolve => setTimeout(resolve, 3000));
            return this.generateSmartPrediction('image_analysis');
        } catch (error) {
            console.error('AI analysis error:', error);
            return this.generateSmartPrediction('fallback');
        }
    }

    canGenerateNextPrediction(userId) {
        const lastTime = this.lastPredictionTime.get(userId);
        if (!lastTime) return true;
        return Date.now() - lastTime > 3000; // 3 ثواني بين التوقعات
    }
}

// 💾 DATABASE MANAGER
class DatabaseManager {
    constructor() {
        this.settingsCache = null;
        this.lastSettingsUpdate = null;
    }

    async getUser(userId) {
        if (db) {
            try {
                const userDoc = await db.collection('users').doc(userId.toString()).get();
                return userDoc.exists ? userDoc.data() : null;
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        return userDatabase.get(userId) || null;
    }

    async saveUser(userId, userData) {
        if (db) {
            try {
                await db.collection('users').doc(userId.toString()).set(userData, { merge: true });
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        userDatabase.set(userId, userData);
    }

    async addPayment(paymentData) {
        const paymentId = Date.now().toString();
        if (db) {
            try {
                await db.collection('payments').doc(paymentId).set({
                    ...paymentData,
                    id: paymentId,
                    status: 'pending',
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        paymentDatabase.set(paymentId, { 
            ...paymentData, 
            id: paymentId, 
            status: 'pending',
            timestamp: new Date().toISOString()
        });
        return paymentId;
    }

    async getPendingPayments() {
        if (db) {
            try {
                const paymentsSnapshot = await db.collection('payments')
                    .where('status', '==', 'pending')
                    .get();
                return paymentsSnapshot.docs.map(doc => doc.data());
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        return Array.from(paymentDatabase.values()).filter(p => p.status === 'pending');
    }

    async updatePayment(paymentId, updates) {
        if (db) {
            try {
                await db.collection('payments').doc(paymentId).update(updates);
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        const payment = paymentDatabase.get(paymentId);
        if (payment) {
            paymentDatabase.set(paymentId, { ...payment, ...updates });
        }
    }

    async getAllUsers() {
        if (db) {
            try {
                const usersSnapshot = await db.collection('users').get();
                return usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        return Array.from(userDatabase.entries()).map(([id, data]) => ({ id, ...data }));
    }

    async getSettings() {
        // استخدام الكاش إذا كان حديثاً
        if (this.settingsCache && this.lastSettingsUpdate && 
            (Date.now() - this.lastSettingsUpdate) < 30000) { // 30 ثانية كاش
            return this.settingsCache;
        }

        let settings = null;
        
        if (db) {
            try {
                const settingsDoc = await db.collection('settings').doc('config').get();
                if (settingsDoc.exists) {
                    settings = settingsDoc.data();
                } else {
                    // إنشاء الإعدادات الافتراضية
                    settings = {
                        prices: CONFIG.SUBSCRIPTION_PRICES,
                        payment_links: CONFIG.PAYMENT_LINKS,
                        updated_at: new Date().toISOString()
                    };
                    await db.collection('settings').doc('config').set(settings);
                }
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
                settings = null;
            }
        }
        
        if (!settings) {
            // استخدام التخزين المحلي
            settings = settingsDatabase.get('config');
            if (!settings) {
                settings = {
                    prices: CONFIG.SUBSCRIPTION_PRICES,
                    payment_links: CONFIG.PAYMENT_LINKS,
                    updated_at: new Date().toISOString()
                };
                settingsDatabase.set('config', settings);
            }
        }

        // تحديث الكاش
        this.settingsCache = settings;
        this.lastSettingsUpdate = Date.now();
        
        return settings;
    }

    async updateSettings(newSettings) {
        const updatedSettings = {
            ...newSettings,
            updated_at: new Date().toISOString()
        };

        if (db) {
            try {
                await db.collection('settings').doc('config').set(updatedSettings, { merge: true });
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        
        // تحديث التخزين المحلي والكاش
        settingsDatabase.set('config', updatedSettings);
        this.settingsCache = updatedSettings;
        this.lastSettingsUpdate = Date.now();
        
        return updatedSettings;
    }

    async getPayment(paymentId) {
        if (db) {
            try {
                const paymentDoc = await db.collection('payments').doc(paymentId).get();
                return paymentDoc.exists ? paymentDoc.data() : null;
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        return paymentDatabase.get(paymentId) || null;
    }

    async getAllPayments() {
        if (db) {
            try {
                const paymentsSnapshot = await db.collection('payments').get();
                return paymentsSnapshot.docs.map(doc => doc.data());
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        return Array.from(paymentDatabase.values());
    }
}

// INITIALIZE SYSTEMS
const goalAI = new GoalPredictionAI();
const dbManager = new DatabaseManager();
const fakeStats = new FakeStatistics();

// 🎯 BOT SETUP
bot.use(session({ 
    defaultSession: () => ({ 
        step: 'start',
        userData: {},
        verificationCode: null,
        accountId: null,
        lastPrediction: null,
        paymentType: null,
        adminMode: false,
        adminStep: null,
        awaitingPaymentAccount: false,
        paymentAccount: null,
        lastImageUrl: null,
        waitingForResult: false
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
        ['🔙 الخروج من الإدمن']
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
        ['⚙️ الإعدادات العامة', '🔄 إعادة التعيين'],
        ['🔙 رجوع']
    ]).resize();
};

// 🛠️ UTILITY FUNCTIONS
function calculateRemainingDays(endDate) {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
}

function addSubscriptionDays(startDate, type) {
    const start = new Date(startDate);
    const types = {
        week: 7,
        month: 30,
        three_months: 90,
        year: 365
    };
    start.setDate(start.getDate() + types[type]);
    return start.toISOString();
}

// 🎯 BOT COMMANDS

bot.start(async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const userName = ctx.from.first_name;

        // إرسال الصورة أولاً
        try {
            await ctx.replyWithPhoto(CONFIG.START_IMAGE, {
                caption: `🎉 مرحباً بك في نظام GOAL Predictor Pro 🚀`
            });
        } catch (photoError) {
            console.log('⚠️ Could not send start image, continuing with text...');
        }

        // 🔍 التحقق من وجود المستخدم في قاعدة البيانات
        const existingUser = await dbManager.getUser(userId);
        
        if (existingUser) {
            // 📋 المستخدم موجود - عرض حالة الاشتراك
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
            // 👤 مستخدم جديد - بدء التسجيل
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

🔍 *المزايا المتقدمة:*
✅ خوارزمية ذكية مخفية للتوقع
✅ تحليل بالذكاء الاصطناعي ثقة 100%
✅ نتائج فورية مع شرح مفصل

💎 *المطور:* ${CONFIG.DEVELOPER}
📢 *القناة:* ${CONFIG.CHANNEL}

🔢 *الآن اضغط على "🔐 إدخال رقم الحساب" لبدء التسجيل*
            `;

            await ctx.replyWithMarkdown(welcomeMessage, getLoginKeyboard());
        }

        console.log(`🆕 User ${userName} (${userId}) started the bot`);

    } catch (error) {
        console.error('Start command error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام، يرجى المحاولة لاحقاً');
    }
});

// 📝 HANDLE TEXT MESSAGES
bot.on('text', async (ctx) => {
    try {
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

        // 🔐 زر إدخال رقم الحساب
        if (text === '🔐 إدخال رقم الحساب' && session.step === 'start') {
            ctx.session.step = 'awaiting_account_id';
            await ctx.replyWithMarkdown(
                '🔢 *الخطوة 1:* أرسل رقم حساب 1xBet الخاص بك (10 أرقام)\n\n' +
                '💡 *ملاحظة:* يجب أن يكون الرقم الحقيقي الخاص بك'
            );
            return;
        }

        // 🔐 STEP 1: Validate 1xBet Account (يقبل أي 10 أرقام)
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
                
                // ✅ تسجيل المستخدم الجديد
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
                    losses: 0
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
                // حفظ رقم الحساب الجديد
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
                    await handlePrediction(ctx, userData);
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
                        '🖼️ *الأنواع المدعومة:* PNG, JPG, JPEG\n\n' +
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
                    } else if (/^\d{10}$/.test(text)) {
                        await ctx.replyWithMarkdown(
                            '❌ *أنت مسجل بالفعل*\n\n' +
                            '🔐 يمكنك استخدام الأزرار في الأسفل للتحكم في النظام',
                            getMainKeyboard()
                        );
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
        }

    } catch (error) {
        console.error('Text handler error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ غير متوقع*', getMainKeyboard());
    }
});

// 🖼️ IMAGE ANALYSIS HANDLER
bot.on('photo', async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const session = ctx.session;
        
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

        // 📸 معالجة الصورة
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileLink = await bot.telegram.getFileLink(photo.file_id);
        const imageUrl = fileLink.href;

        console.log(`📸 Processing image from user ${userId}`);

        const processingMsg = await ctx.reply('🔄 جاري تحليل صورة المباراة بالذكاء الاصطناعي...\n⏳ تستخدم الخوارزمية الذكية المخفية');

        try {
            const prediction = await goalAI.analyzeImageWithAI(imageUrl);
            
            // حفظ رابط الصورة في الجلسة
            ctx.session.lastImageUrl = imageUrl;
            
            // 📊 تحديث إحصائيات المستخدم
            if (userData.subscription_status !== 'active') {
                userData.free_attempts--;
            }
            userData.total_predictions = (userData.total_predictions || 0) + 1;
            userData.lastPrediction = prediction;
            await dbManager.saveUser(userId, userData);

            const analysisMessage = `
🤖 *تحليل الذكاء الاصطناعي المتقدم - v${CONFIG.VERSION}*

📸 *الصورة:* ✅ تم التحليل بنجاح
🕒 *الوقت:* ${new Date().toLocaleString('ar-EG')}
🔧 *الخوارزمية:* ${prediction.algorithm}
🔐 *الحساب:* \`${userData.onexbet}\`

🎯 *نتيجة التحليل:*
${prediction.type}
📈 *الاحتمالية:* ${prediction.probability}%
🎯 *الثقة:* ${prediction.confidence}%

💡 *التحليل:*
${prediction.reasoning}

${userData.subscription_status !== 'active' ? 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}` : 
    `✅ *اشتراك نشط - محاولات غير محدودة*`}

🎯 *استخدم زر "التوقع التالي" في الأسفل لتوليد توقعات إضافية*
            `;

            await ctx.replyWithMarkdown(analysisMessage, getMainKeyboard());
            
            // إضافة أزرار الفوز والخسارة
            const resultKeyboard = Markup.inlineKeyboard([
                [Markup.button.callback('🎉 فزت', `win_${userData.total_predictions}`)],
                [Markup.button.callback('💔 خسرت', `lose_${userData.total_predictions}`)]
            ]);

            await ctx.replyWithMarkdown(
                '📊 *ما هي نتيجة التوقع؟*\n\n' +
                '🎉 *فزت* - إذا كان التوقع صحيح\n' +
                '💔 *خسرت* - إذا كان التوقع خاطئ\n\n' +
                '🔄 سيتم تحديث إحصائيك تلقائياً',
                resultKeyboard
            );

            await ctx.deleteMessage(processingMsg.message_id);

            console.log(`✅ Analysis completed for user ${userId}`);

        } catch (analysisError) {
            console.error('Analysis error:', analysisError);
            
            // 🎯 استخدام النظام الاحتياطي في حالة الخطأ
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
        await ctx.replyWithMarkdown('❌ *حدث خطأ في التحليل*\n\n🔄 يرجى إرسال الصورة مرة أخرى', getMainKeyboard());
    }
});

// 🎯 HANDLE CALLBACK QUERIES (لأزرار الفوز والخسارة)
bot.on('callback_query', async (ctx) => {
    try {
        const callbackData = ctx.callbackQuery.data;
        const userId = ctx.from.id.toString();
        
        if (callbackData.startsWith('win_') || callbackData.startsWith('lose_')) {
            const isWin = callbackData.startsWith('win_');
            const predictionIndex = parseInt(callbackData.split('_')[1]);
            
            const userData = await dbManager.getUser(userId);
            if (!userData) {
                await ctx.answerCbQuery('❌ لم يتم العثور على بيانات المستخدم');
                return;
            }
            
            // تحديث إحصائيات الفوز/الخسارة
            if (isWin) {
                userData.wins = (userData.wins || 0) + 1;
                userData.correct_predictions = (userData.correct_predictions || 0) + 1;
                await ctx.answerCbQuery('🎉 تم تسجيل الفوز بنجاح!');
            } else {
                userData.losses = (userData.losses || 0) + 1;
                await ctx.answerCbQuery('💔 تم تسجيل الخسارة');
            }
            
            await dbManager.saveUser(userId, userData);
            
            // إرسال رسالة تأكيد
            const resultMessage = isWin ? 
                `🎉 *مبروك الفوز!*\n\n` +
                `✅ توقعك كان صحيحاً\n` +
                `📈 تم تحديث إحصائيك\n\n` +
                `🎯 يمكنك الآن استخدام زر "التوقع التالي"` :
                `💔 *للأسف خسرت*\n\n` +
                `❌ توقعك كان خاطئاً\n` +
                `📉 تم تحديث إحصائيك\n\n` +
                `🎯 جرب مرة أخرى مع "التوقع التالي"`;
            
            await ctx.replyWithMarkdown(resultMessage, getMainKeyboard());
            
            // حذف الرسالة القديمة التي تحتوي على الأزرار
            try {
                await ctx.deleteMessage(ctx.callbackQuery.message.message_id);
            } catch (deleteError) {
                console.log('Could not delete message:', deleteError);
            }
        }
        
        // معالجة أزرار القبول والرفع في الإدمن
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

async function handlePrediction(ctx, userData) {
    const userId = ctx.from.id.toString();
    
    // 🔐 التحقق من المحاولات المجانية أو الاشتراك
    if (userData.subscription_status !== 'active' && userData.free_attempts <= 0) {
        await ctx.replyWithMarkdown(
            '🚫 *انتهت المحاولات المجانية*\n\n' +
            '💳 يرجى الاشتراك للمتابعة في استخدام الخدمة\n\n' +
            '📸 *أو أرسل صورة مباراة للحصول على توقع فوري*',
            getMainKeyboard()
        );
        return;
    }

    // التحقق من الوقت بين التوقعات
    if (!goalAI.canGenerateNextPrediction(userId)) {
        await ctx.replyWithMarkdown(
            '⏳ *يرجى الانتظار 3 ثواني بين التوقعات*\n\n' +
            '🔄 جاري تحضير التوقع التالي...',
            getMainKeyboard()
        );
        return;
    }

    // 📊 تحديث إحصائيات المستخدم
    if (userData.subscription_status !== 'active') {
        userData.free_attempts--;
    }
    userData.total_predictions = (userData.total_predictions || 0) + 1;
    
    const processingMsg = await ctx.reply('🔄 جاري توليد التوقع التالي بالذكاء الاصطناعي...\n⚽ تستخدم الخوارزمية الذكية المخفية');

    try {
        // تأخير 3 ثواني لمحاكاة المعالجة
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const nextPrediction = goalAI.generateNextPrediction(userId);
        userData.lastPrediction = nextPrediction;
        await dbManager.saveUser(userId, userData);

        const predictionMessage = `
🤖 *التوقع التالي - الذكاء الاصطناعي المتقدم*

${nextPrediction.type}
📈 *الاحتمالية:* ${nextPrediction.probability}%
🎯 *الثقة:* ${nextPrediction.confidence}%

💡 *التحليل الجديد:*
${nextPrediction.reasoning}

${userData.subscription_status !== 'active' ? 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}` : 
    `✅ *اشتراك نشط - محاولات غير محدودة*`}

🔄 *تم توليد توقع جديد باستخدام خوارزمية ذكية مخفية*
        `;

        await ctx.replyWithMarkdown(predictionMessage, getMainKeyboard());
        
        // إضافة أزرار الفوز والخسارة
        const resultKeyboard = Markup.inlineKeyboard([
            [Markup.button.callback('🎉 فزت', `win_${userData.total_predictions}`)],
            [Markup.button.callback('💔 خسرت', `lose_${userData.total_predictions}`)]
        ]);

        await ctx.replyWithMarkdown(
            '📊 *ما هي نتيجة التوقع؟*\n\n' +
            '🎉 *فزت* - إذا كان التوقع صحيح\n' +
            '💔 *خسرت* - إذا كان التوقع خاطئ\n\n' +
            '🔄 سيتم تحديث إحصائيك تلقائياً',
            resultKeyboard
        );

        await ctx.deleteMessage(processingMsg.message_id);

    } catch (error) {
        console.error('Prediction error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في توليد التوقع*', getMainKeyboard());
        await ctx.deleteMessage(processingMsg.message_id);
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
        `💔 ${userData.losses || 0} خسارة` +
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

        // استخدام رقم الحساب من الجلسة إذا كان متوفراً
        const accountNumber = ctx.session.paymentAccount || userData.onexbet;

        const paymentData = {
            user_id: userId,
            onexbet: accountNumber,
            screenshot_url: imageUrl,
            amount: prices[ctx.session.paymentType],
            subscription_type: ctx.session.paymentType,
            username: userData.username,
            timestamp: new Date().toISOString()
        };

        const paymentId = await dbManager.addPayment(paymentData);
        
        // إعلام الإدارة مع الصورة
        try {
            await bot.telegram.sendPhoto(
                CONFIG.ADMIN_ID,
                imageUrl,
                {
                    caption: `🆕 *طلب دفع جديد*\n\n` +
                            `👤 المستخدم: ${userData.username}\n` +
                            `🔐 الحساب: ${accountNumber}\n` +
                            `💰 المبلغ: ${paymentData.amount}$\n` +
                            `📦 الباقة: ${ctx.session.paymentType}\n` +
                            `🆔 الرقم: ${paymentId}\n` +
                            `📅 الوقت: ${new Date().toLocaleString('ar-EG')}`,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '✅ قبول', callback_data: `accept_${paymentId}` },
                                { text: '❌ رفض', callback_data: `reject_${paymentId}` }
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

        // تنظيف جلسة الدفع
        ctx.session.paymentType = null;
        ctx.session.awaitingPaymentAccount = false;
        ctx.session.paymentAccount = null;
    } catch (error) {
        console.error('Payment screenshot error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في معالجة صورة الدفع*', getMainKeyboard());
    }
}

// 🔧 ADMIN HANDLERS - لوحة التحكم الكاملة
async function handleAdminCommands(ctx, text) {
    const session = ctx.session;
    
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
        case 'broadcast':
            await handleAdminBroadcast(ctx, text);
            break;
        case 'search':
            await handleAdminSearch(ctx, text);
            break;
        case 'reset_confirm':
            await handleAdminResetConfirm(ctx, text);
            break;
        default:
            await handleAdminMain(ctx, text);
            break;
    }
}

async function handleAdminMain(ctx, text) {
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
                '📢 *إرسال إشعار لجميع المستخدمين*\n\n' +
                '⏰ أرسل الرسالة التي تريد إرسالها لجميع المستخدمين\n' +
                '❌ أرسل "إلغاء" للتراجع'
            );
            break;
            
        case '🔍 بحث عن مستخدم':
            ctx.session.adminStep = 'search';
            await ctx.replyWithMarkdown(
                '🔍 *بحث عن مستخدم*\n\n' +
                'يمكنك البحث باستخدام:\n' +
                '• رقم التليجرام\n' +
                '• رقم حساب 1xBet\n' +
                '• اسم المستخدم\n\n' +
                '❌ أرسل "رجوع" للتراجع'
            );
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
}

async function handleAdminStats(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const payments = await dbManager.getAllPayments();
        const pendingPayments = payments.filter(p => p.status === 'pending');
        const acceptedPayments = payments.filter(p => p.status === 'accepted');
        
        const activeUsers = users.filter(u => u.subscription_status === 'active');
        const freeUsers = users.filter(u => u.subscription_status === 'free');
        const expiredUsers = users.filter(u => u.subscription_status === 'expired');
        
        const totalRevenue = acceptedPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const botStats = fakeStats.getStats();
        
        const statsMessage = `
📊 *إحصائيات النظام الشاملة*

👥 *المستخدمين:*
• الإجمالي: ${users.length}
• نشطين: ${activeUsers.length}
• مجانين: ${freeUsers.length}
• منتهيين: ${expiredUsers.length}

💰 *المدفوعات:*
• المعلقة: ${pendingPayments.length}
• المقبولة: ${acceptedPayments.length}
• الإجمالي: ${payments.length}
• الإيرادات: ${totalRevenue}$

🎯 *التوقعات:*
• الإجمالية: ${users.reduce((sum, user) => sum + (user.total_predictions || 0), 0)}

📈 *إحصائيات البوت:*
• المستخدمين: ${botStats.totalUsers.toLocaleString()}
• النشطين: ${botStats.activeUsers}

🕒 *آخر تحديث:* ${new Date().toLocaleString('ar-EG')}
        `;
        
        await ctx.replyWithMarkdown(statsMessage, getAdminMainKeyboard());
    } catch (error) {
        console.error('Admin stats error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب الإحصائيات*', getAdminMainKeyboard());
    }
}

async function handleAdminUsers(ctx, text) {
    switch (text) {
        case '📋 قائمة المستخدمين':
            await handleAdminUsersList(ctx);
            break;
            
        case '✅ المشتركين النشطين':
            await handleAdminActiveUsers(ctx);
            break;
            
        case '🆓 المستخدمين المجانين':
            await handleAdminFreeUsers(ctx);
            break;
            
        case '📈 إحصائيات المستخدمين':
            await handleAdminUsersStats(ctx);
            break;
            
        case '🔙 رجوع':
            ctx.session.adminStep = 'main';
            await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getAdminMainKeyboard());
            break;
            
        default:
            await ctx.replyWithMarkdown('❌ *خيار غير معروف*', getAdminUsersKeyboard());
            break;
    }
}

async function handleAdminUsersList(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        
        let message = `📋 *قائمة المستخدمين (${users.length})*\n\n`;
        
        users.slice(0, 15).forEach((user, index) => {
            message += `${index + 1}. ${user.username} | ${user.onexbet}\n`;
            message += `   👤 ${user.user_id} | ${user.subscription_status}\n`;
            if (user.subscription_end_date) {
                const days = calculateRemainingDays(user.subscription_end_date);
                message += `   ⏳ ${days} يوم متبقي\n`;
            }
            message += `   📊 ${user.total_predictions || 0} توقع\n\n`;
        });
        
        if (users.length > 15) {
            message += `... و ${users.length - 15} مستخدم آخر`;
        }
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin users list error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب قائمة المستخدمين*', getAdminUsersKeyboard());
    }
}

async function handleAdminActiveUsers(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const activeUsers = users.filter(u => u.subscription_status === 'active');
        
        let message = `✅ *المشتركين النشطين (${activeUsers.length})*\n\n`;
        
        activeUsers.slice(0, 10).forEach((user, index) => {
            const days = calculateRemainingDays(user.subscription_end_date);
            message += `${index + 1}. ${user.username}\n`;
            message += `   🔐 ${user.onexbet} | ${user.subscription_type}\n`;
            message += `   ⏳ ${days} يوم متبقي\n\n`;
        });
        
        if (activeUsers.length === 0) {
            message += '❌ لا يوجد مشتركين نشطين حالياً';
        }
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin active users error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب المشتركين النشطين*', getAdminUsersKeyboard());
    }
}

async function handleAdminFreeUsers(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const freeUsers = users.filter(u => u.subscription_status === 'free');
        
        let message = `🆓 *المستخدمين المجانين (${freeUsers.length})*\n\n`;
        
        freeUsers.slice(0, 10).forEach((user, index) => {
            message += `${index + 1}. ${user.username}\n`;
            message += `   🔐 ${user.onexbet}\n`;
            message += `   🎯 ${user.free_attempts} محاولة متبقية\n\n`;
        });
        
        if (freeUsers.length === 0) {
            message += '✅ جميع المستخدمين مشتركين';
        }
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin free users error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب المستخدمين المجانين*', getAdminUsersKeyboard());
    }
}

async function handleAdminUsersStats(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        
        const predictions = users.reduce((sum, user) => sum + (user.total_predictions || 0), 0);
        const accuracy = users.reduce((sum, user) => sum + (user.correct_predictions || 0), 0);
        const avgAccuracy = predictions > 0 ? Math.round((accuracy / predictions) * 100) : 0;
        
        const statsMessage = `
📈 *إحصائيات المستخدمين*

👥 إجمالي المستخدمين: ${users.length}
🎯 إجمالي التوقعات: ${predictions}
✅ التوقعات الصحيحة: ${accuracy}
📊 متوسط الدقة: ${avgAccuracy}%

📅 جديد اليوم: ${users.filter(u => {
    const joinDate = new Date(u.joined_at);
    const today = new Date();
    return joinDate.toDateString() === today.toDateString();
}).length}

📅 جديد الأسبوع: ${users.filter(u => {
    const joinDate = new Date(u.joined_at);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return joinDate > weekAgo;
}).length}
        `;
        
        await ctx.replyWithMarkdown(statsMessage, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin users stats error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب إحصائيات المستخدمين*', getAdminUsersKeyboard());
    }
}

async function handleAdminPayments(ctx, text) {
    switch (text) {
        case '📥 الطلبات المعلقة':
            await handleAdminPendingPayments(ctx);
            break;
            
        case '✅ الطلبات المقبولة':
            await handleAdminAcceptedPayments(ctx);
            break;
            
        case '❌ الطلبات المرفوضة':
            await handleAdminRejectedPayments(ctx);
            break;
            
        case '📋 كل الطلبات':
            await handleAdminAllPayments(ctx);
            break;
            
        case '🔙 رجوع':
            ctx.session.adminStep = 'main';
            await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getAdminMainKeyboard());
            break;
            
        default:
            await ctx.replyWithMarkdown('❌ *خيار غير معروف*', getAdminPaymentsKeyboard());
            break;
    }
}

async function handleAdminPendingPayments(ctx) {
    try {
        const payments = await dbManager.getPendingPayments();
        
        if (payments.length === 0) {
            await ctx.replyWithMarkdown('✅ *لا توجد طلبات دفع معلقة*', getAdminPaymentsKeyboard());
            return;
        }
        
        for (const payment of payments.slice(0, 5)) {
            try {
                await ctx.replyWithPhoto(payment.screenshot_url, {
                    caption: `📥 *طلب دفع معلق #${payment.id}*\n\n` +
                            `👤 المستخدم: ${payment.username}\n` +
                            `🔐 الحساب: ${payment.onexbet}\n` +
                            `💰 المبلغ: ${payment.amount}$\n` +
                            `📦 الباقة: ${payment.subscription_type}\n` +
                            `📅 التاريخ: ${new Date(payment.timestamp).toLocaleString('ar-EG')}`,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '✅ قبول', callback_data: `accept_${payment.id}` },
                                { text: '❌ رفض', callback_data: `reject_${payment.id}` }
                            ]
                        ]
                    }
                });
            } catch (photoError) {
                console.error('Error sending payment photo:', photoError);
                await ctx.replyWithMarkdown(
                    `📥 *طلب دفع معلق #${payment.id}*\n\n` +
                    `👤 المستخدم: ${payment.username}\n` +
                    `🔐 الحساب: ${payment.onexbet}\n` +
                    `💰 المبلغ: ${payment.amount}$\n` +
                    `📦 الباقة: ${payment.subscription_type}\n` +
                    `📅 التاريخ: ${new Date(payment.timestamp).toLocaleString('ar-EG')}\n\n` +
                    `❌ *تعذر تحميل صورة الدفع*`,
                    getAdminPaymentsKeyboard()
                );
            }
        }
        
        if (payments.length > 5) {
            await ctx.replyWithMarkdown(`... و ${payments.length - 5} طلب دفع آخر`, getAdminPaymentsKeyboard());
        }
    } catch (error) {
        console.error('Admin pending payments error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب الطلبات المعلقة*', getAdminPaymentsKeyboard());
    }
}

async function handleAdminAcceptedPayments(ctx) {
    try {
        const payments = await dbManager.getAllPayments();
        const acceptedPayments = payments.filter(p => p.status === 'accepted');
        
        if (acceptedPayments.length === 0) {
            await ctx.replyWithMarkdown('✅ *لا توجد طلبات دفع مقبولة*', getAdminPaymentsKeyboard());
            return;
        }
        
        let message = `✅ *الطلبات المقبولة (${acceptedPayments.length})*\n\n`;
        
        acceptedPayments.slice(0, 10).forEach((payment, index) => {
            message += `${index + 1}. ${payment.username}\n`;
            message += `   🔐 ${payment.onexbet} | ${payment.subscription_type}\n`;
            message += `   💰 ${payment.amount}$ | ${new Date(payment.timestamp).toLocaleDateString('ar-EG')}\n\n`;
        });
        
        await ctx.replyWithMarkdown(message, getAdminPaymentsKeyboard());
    } catch (error) {
        console.error('Admin accepted payments error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب الطلبات المقبولة*', getAdminPaymentsKeyboard());
    }
}

async function handleAdminRejectedPayments(ctx) {
    try {
        const payments = await dbManager.getAllPayments();
        const rejectedPayments = payments.filter(p => p.status === 'rejected');
        
        if (rejectedPayments.length === 0) {
            await ctx.replyWithMarkdown('✅ *لا توجد طلبات دفع مرفوضة*', getAdminPaymentsKeyboard());
            return;
        }
        
        let message = `❌ *الطلبات المرفوضة (${rejectedPayments.length})*\n\n`;
        
        rejectedPayments.slice(0, 10).forEach((payment, index) => {
            message += `${index + 1}. ${payment.username}\n`;
            message += `   🔐 ${payment.onexbet} | ${payment.subscription_type}\n`;
            message += `   💰 ${payment.amount}$ | ${new Date(payment.timestamp).toLocaleDateString('ar-EG')}\n\n`;
        });
        
        await ctx.replyWithMarkdown(message, getAdminPaymentsKeyboard());
    } catch (error) {
        console.error('Admin rejected payments error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب الطلبات المرفوضة*', getAdminPaymentsKeyboard());
    }
}

async function handleAdminAllPayments(ctx) {
    try {
        const payments = await dbManager.getAllPayments();
        
        const pending = payments.filter(p => p.status === 'pending').length;
        const accepted = payments.filter(p => p.status === 'accepted').length;
        const rejected = payments.filter(p => p.status === 'rejected').length;
        const totalRevenue = payments.filter(p => p.status === 'accepted').reduce((sum, p) => sum + p.amount, 0);
        
        const statsMessage = `
📋 *إحصائيات المدفوعات*

📥 المعلقة: ${pending}
✅ المقبولة: ${accepted}
❌ المرفوضة: ${rejected}
💰 الإيرادات: ${totalRevenue}$
📈 إجمالي الطلبات: ${payments.length}
        `;
        
        await ctx.replyWithMarkdown(statsMessage, getAdminPaymentsKeyboard());
    } catch (error) {
        console.error('Admin all payments error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب إحصائيات المدفوعات*', getAdminPaymentsKeyboard());
    }
}

async function handleAdminSettings(ctx, text) {
    switch (text) {
        case '💰 تعديل الأسعار':
            await handleAdminPriceSettings(ctx);
            break;
            
        case '🔗 تعديل روابط الدفع':
            await handleAdminPaymentLinks(ctx);
            break;
            
        case '⚙️ الإعدادات العامة':
            await handleAdminGeneralSettings(ctx);
            break;
            
        case '🔄 إعادة التعيين':
            await handleAdminReset(ctx);
            break;
            
        case '🔙 رجوع':
            ctx.session.adminStep = 'main';
            await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getAdminMainKeyboard());
            break;
            
        default:
            if (text.startsWith('سعر_')) {
                await handlePriceUpdate(ctx, text);
            } else if (text.startsWith('رابط_')) {
                await handlePaymentLinkUpdate(ctx, text);
            } else {
                await ctx.replyWithMarkdown('❌ *خيار غير معروف*', getAdminSettingsKeyboard());
            }
            break;
    }
}

async function handleAdminPriceSettings(ctx) {
    try {
        const settings = await dbManager.getSettings();
        const prices = settings.prices || CONFIG.SUBSCRIPTION_PRICES;
        
        const priceMessage = `
💰 *الإعدادات الحالية*

أسبوعي: ${prices.week}$
شهري: ${prices.month}$ 
3 أشهر: ${prices.three_months}$
سنوي: ${prices.year}$

📝 *للتعديل:* 
سعر_week_50 (لتغيير سعر الأسبوعي لـ 50)
سعر_month_100 (لتغيير سعر الشهري لـ 100)
سعر_three_months_200 (لتغيير سعر 3 أشهر لـ 200)
سعر_year_500 (لتغيير السعر السنوي لـ 500)
        `;
        
        await ctx.replyWithMarkdown(priceMessage, getAdminSettingsKeyboard());
    } catch (error) {
        console.error('Admin price settings error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب إعدادات الأسعار*', getAdminSettingsKeyboard());
    }
}

async function handleAdminPaymentLinks(ctx) {
    try {
        const settings = await dbManager.getSettings();
        const payment_links = settings.payment_links || CONFIG.PAYMENT_LINKS;
        
        const linksMessage = `
🔗 *روابط الدفع الحالية*

أسبوعي: ${payment_links.week}
شهري: ${payment_links.month}
3 أشهر: ${payment_links.three_months}
سنوي: ${payment_links.year}

📝 *للتعديل:* 
رابط_week_https://new-link.com
رابط_month_https://new-link.com  
رابط_three_months_https://new-link.com
رابط_year_https://new-link.com
        `;
        
        await ctx.replyWithMarkdown(linksMessage, getAdminSettingsKeyboard());
    } catch (error) {
        console.error('Admin payment links error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب روابط الدفع*', getAdminSettingsKeyboard());
    }
}

async function handleAdminGeneralSettings(ctx) {
    try {
        const settings = await dbManager.getSettings();
        
        const generalMessage = `
⚙️ *الإعدادات العامة*

🆔 الإصدار: ${CONFIG.VERSION}
👤 المطور: ${CONFIG.DEVELOPER}
📢 القناة: ${CONFIG.CHANNEL}
🕒 آخر تحديث: ${settings.updated_at ? new Date(settings.updated_at).toLocaleString('ar-EG') : 'غير متوفر'}

🔧 *معلومات النظام:*
• البوت يعمل بشكل طبيعي
• قاعدة البيانات: ${db ? 'Firebase' : 'محلية'}
• الصحة: ✅ جيدة
        `;
        
        await ctx.replyWithMarkdown(generalMessage, getAdminSettingsKeyboard());
    } catch (error) {
        console.error('Admin general settings error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في جلب الإعدادات العامة*', getAdminSettingsKeyboard());
    }
}

async function handleAdminReset(ctx) {
    await ctx.replyWithMarkdown(
        '🔄 *إعادة التعيين*\n\n' +
        '⚠️ هذه العملية ستعيد تعيين بعض الإعدادات\n\n' +
        '❌ *تحذير:* لا يمكن التراجع عن هذه العملية\n\n' +
        'أرسل "تأكيد" للمواصلة أو "إلغاء" للتراجع'
    );
    
    ctx.session.adminStep = 'reset_confirm';
}

async function handleAdminResetConfirm(ctx, text) {
    if (text === 'تأكيد') {
        try {
            // إعادة تعيين الإعدادات للافتراضية
            const defaultSettings = {
                prices: CONFIG.SUBSCRIPTION_PRICES,
                payment_links: CONFIG.PAYMENT_LINKS,
                updated_at: new Date().toISOString()
            };
            
            await dbManager.updateSettings(defaultSettings);
            
            await ctx.replyWithMarkdown(
                '✅ *تم إعادة التعيين بنجاح*\n\n' +
                '🔄 تم استعادة الإعدادات الافتراضية',
                getAdminSettingsKeyboard()
            );
        } catch (error) {
            console.error('Admin reset error:', error);
            await ctx.replyWithMarkdown('❌ *حدث خطأ في إعادة التعيين*', getAdminSettingsKeyboard());
        }
    } else {
        await ctx.replyWithMarkdown(
            '❌ *تم إلغاء العملية*',
            getAdminSettingsKeyboard()
        );
    }
    
    ctx.session.adminStep = 'settings';
}

async function handleAdminBroadcast(ctx, text) {
    if (text.toLowerCase() === 'إلغاء') {
        ctx.session.adminStep = 'main';
        await ctx.replyWithMarkdown('❌ *تم إلغاء الإرسال*', getAdminMainKeyboard());
        return;
    }

    try {
        const users = await dbManager.getAllUsers();
        let successCount = 0;
        let failCount = 0;

        await ctx.replyWithMarkdown(`📤 *جاري إرسال الرسالة لـ ${users.length} مستخدم...*`);

        for (const user of users) {
            try {
                await bot.telegram.sendMessage(
                    user.user_id,
                    `📢 *إشعار من الإدارة:*\n\n${text}\n\n${CONFIG.DEVELOPER}`,
                    { parse_mode: 'Markdown' }
                );
                successCount++;
                // تأخير بسيط لتجنب حظر تيليجرام
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                failCount++;
                console.error(`Failed to send to ${user.user_id}:`, error.message);
            }
        }

        await ctx.replyWithMarkdown(
            `✅ *تم الانتهاء من الإرسال*\n\n` +
            `✅ نجح: ${successCount}\n` +
            `❌ فشل: ${failCount}\n` +
            `📊 الإجمالي: ${users.length}`
        );
    } catch (error) {
        console.error('Admin broadcast error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في إرسال الإشعار*', getAdminMainKeyboard());
    }

    ctx.session.adminStep = 'main';
    await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getAdminMainKeyboard());
}

async function handleAdminSearch(ctx, text) {
    if (text.toLowerCase() === 'رجوع') {
        ctx.session.adminStep = 'main';
        await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getAdminMainKeyboard());
        return;
    }

    try {
        const users = await dbManager.getAllUsers();
        const searchTerm = text.toLowerCase();
        
        const results = users.filter(user => 
            user.user_id.toLowerCase().includes(searchTerm) ||
            user.onexbet.includes(searchTerm) ||
            user.username.toLowerCase().includes(searchTerm)
        );

        if (results.length === 0) {
            await ctx.replyWithMarkdown('❌ *لم يتم العثور على نتائج*', getAdminMainKeyboard());
            return;
        }

        let message = `🔍 *نتائج البحث (${results.length})*\n\n`;
        
        results.slice(0, 5).forEach((user, index) => {
            message += `${index + 1}. ${user.username}\n`;
            message += `   👤 ${user.user_id}\n`;
            message += `   🔐 ${user.onexbet}\n`;
            message += `   📦 ${user.subscription_status}\n`;
            if (user.subscription_end_date) {
                const days = calculateRemainingDays(user.subscription_end_date);
                message += `   ⏳ ${days} يوم متبقي\n`;
            }
            message += '\n';
        });

        if (results.length > 5) {
            message += `... و ${results.length - 5} نتيجة أخرى`;
        }

        await ctx.replyWithMarkdown(message, getAdminMainKeyboard());
    } catch (error) {
        console.error('Admin search error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في البحث*', getAdminMainKeyboard());
    }
    
    ctx.session.adminStep = 'main';
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
        
        // تفعيل الاشتراك
        const startDate = new Date().toISOString();
        const endDate = addSubscriptionDays(startDate, payment.subscription_type);
        
        userData.subscription_status = 'active';
        userData.subscription_type = payment.subscription_type;
        userData.subscription_start_date = startDate;
        userData.subscription_end_date = endDate;
        userData.free_attempts = 0; // إلغاء المحاولات المجانية
        
        await dbManager.saveUser(payment.user_id, userData);
        await dbManager.updatePayment(paymentId, { 
            status: 'accepted',
            processed_at: new Date().toISOString(),
            processed_by: CONFIG.ADMIN_ID
        });
        
        // إعلام المستخدم
        try {
            await bot.telegram.sendMessage(
                payment.user_id,
                `🎉 *تم تفعيل اشتراكك بنجاح!*\n\n` +
                `✅ ${payment.subscription_type}\n` +
                `💰 ${payment.amount}$\n` +
                `📅 الانتهاء: ${new Date(endDate).toLocaleDateString('ar-EG')}\n` +
                `⏳ المتبقي: ${calculateRemainingDays(endDate)} يوم\n\n` +
                `🎯 يمكنك الآن استخدام الخدمة بدون حدود\n\n` +
                `${CONFIG.DEVELOPER}`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('Error notifying user:', error);
        }
        
        await ctx.answerCbQuery('✅ تم تفعيل الاشتراك');
        await ctx.replyWithMarkdown(
            `✅ *تم تفعيل الاشتراك بنجاح*\n\n` +
            `👤 ${userData.username}\n` +
            `🔐 ${userData.onexbet}\n` +
            `📦 ${payment.subscription_type}\n` +
            `💰 ${payment.amount}$\n` +
            `📅 حتى: ${new Date(endDate).toLocaleDateString('ar-EG')}`,
            getAdminPaymentsKeyboard()
        );

        // تحديث الرسالة الأصلية
        try {
            await ctx.editMessageCaption(
                `✅ *طلب دفع مقبول #${payment.id}*\n\n` +
                `👤 المستخدم: ${payment.username}\n` +
                `🔐 الحساب: ${payment.onexbet}\n` +
                `💰 المبلغ: ${payment.amount}$\n` +
                `📦 الباقة: ${payment.subscription_type}\n` +
                `📅 القبول: ${new Date().toLocaleString('ar-EG')}`
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
            processed_at: new Date().toISOString(),
            processed_by: CONFIG.ADMIN_ID
        });
        
        // إعلام المستخدم
        try {
            await bot.telegram.sendMessage(
                payment.user_id,
                `❌ *تم رفض طلب الدفع*\n\n` +
                `💳 يرجى التحقق من صورة الدفع والمحاولة مرة أخرى\n` +
                `📞 للاستفسار: ${CONFIG.DEVELOPER}`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            console.error('Error notifying user:', error);
        }
        
        await ctx.answerCbQuery('❌ تم رفض الطلب');
        await ctx.replyWithMarkdown(
            `❌ *تم رفض طلب الدفع*\n\n` +
            `🆔 ${paymentId}\n` +
            `👤 ${payment.username}\n` +
            `🔐 ${payment.onexbet}`,
            getAdminPaymentsKeyboard()
        );

        // تحديث الرسالة الأصلية
        try {
            await ctx.editMessageCaption(
                `❌ *طلب دفع مرفوض #${payment.id}*\n\n` +
                `👤 المستخدم: ${payment.username}\n` +
                `🔐 الحساب: ${payment.onexbet}\n` +
                `💰 المبلغ: ${payment.amount}$\n` +
                `📦 الباقة: ${payment.subscription_type}\n` +
                `📅 الرفض: ${new Date().toLocaleString('ar-EG')}`
            );
        } catch (editError) {
            console.log('Could not edit message:', editError);
        }
        
    } catch (error) {
        console.error('Payment reject error:', error);
        await ctx.answerCbQuery('❌ حدث خطأ في رفض الدفع');
    }
}

async function handlePriceUpdate(ctx, text) {
    try {
        const parts = text.split('_');
        if (parts.length !== 3) {
            await ctx.replyWithMarkdown('❌ *صيغة غير صحيحة*', getAdminSettingsKeyboard());
            return;
        }
        
        const type = parts[1];
        const price = parseInt(parts[2]);
        
        if (!['week', 'month', 'three_months', 'year'].includes(type) || isNaN(price)) {
            await ctx.replyWithMarkdown('❌ *نوع أو سعر غير صحيح*', getAdminSettingsKeyboard());
            return;
        }
        
        const settings = await dbManager.getSettings();
        settings.prices[type] = price;
        await dbManager.updateSettings(settings);
        
        await ctx.replyWithMarkdown(
            `✅ *تم تحديث السعر*\n\n` +
            `📦 ${type}: ${price}$\n\n` +
            `🔄 سيتم تطبيق الأسعار الجديدة فوراً`,
            getAdminSettingsKeyboard()
        );
    } catch (error) {
        console.error('Price update error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في تحديث السعر*', getAdminSettingsKeyboard());
    }
}

async function handlePaymentLinkUpdate(ctx, text) {
    try {
        const parts = text.split('_');
        if (parts.length !== 3) {
            await ctx.replyWithMarkdown('❌ *صيغة غير صحيحة*', getAdminSettingsKeyboard());
            return;
        }
        
        const type = parts[1];
        const link = parts[2];
        
        if (!['week', 'month', 'three_months', 'year'].includes(type)) {
            await ctx.replyWithMarkdown('❌ *نوع غير صحيح*', getAdminSettingsKeyboard());
            return;
        }
        
        const settings = await dbManager.getSettings();
        settings.payment_links[type] = link;
        await dbManager.updateSettings(settings);
        
        await ctx.replyWithMarkdown(
            `✅ *تم تحديث رابط الدفع*\n\n` +
            `📦 ${type}: ${link}\n\n` +
            `🔄 سيتم تطبيق الرابط الجديد فوراً`,
            getAdminSettingsKeyboard()
        );
    } catch (error) {
        console.error('Payment link update error:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في تحديث رابط الدفع*', getAdminSettingsKeyboard());
    }
}

// 🚀 START BOT
bot.launch().then(() => {
    console.log('🎉 SUCCESS! AI GOAL Predictor v9.0 is RUNNING!');
    console.log('🤖 Smart Algorithm Version:', goalAI.algorithmVersion);
    console.log('👤 Developer:', CONFIG.DEVELOPER);
    console.log('📢 Channel:', CONFIG.CHANNEL);
    console.log('🌐 Health check: http://localhost:' + PORT);
    console.log('🔧 Admin ID:', CONFIG.ADMIN_ID);
    console.log('✅ Full Admin Panel Activated');
}).catch(console.error);

// ⚡ Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('✅ AI Goal Prediction System Ready!');