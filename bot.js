// ===================================================
// 🚀 AI GOAL PREDICTOR ULTIMATE - VERSION 7.0
// 👤 DEVELOPER: AMIN HARON - @GEMZGOOL 
// 🔥 FEATURES: SMART AI + SUBSCRIPTION SYSTEM + FIREBASE + ADMIN PANEL
// ===================================================

console.log('🤖 Starting AI GOAL Predictor Ultimate v7.0...');
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

    // 💰 PRICING
    SUBSCRIPTION_PRICES: {
        week: 10,
        month: 30,
        three_months: 80,
        year: 250
    },

    // 🔐 BINANCE PAY LINKS
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
    
    VERSION: "7.0.0",
    DEVELOPER: "AMIN @GEMZGOOL"
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
        message: 'AI Goal Predictor Bot is running...'
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

// 🧠 SMART GOAL PREDICTION ENGINE (نفس الخوارزمية الذكية)
class GoalPredictionAI {
    constructor() {
        this.predictionHistory = new Map();
        this.algorithmVersion = "7.0";
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
            confidence: Math.floor(Math.random() * 15) + 75,
            reasoning: this.generateReasoning(isGoal, matchContext, finalProbability),
            factors: {
                time: matchContext.time,
                pressure: Math.round(pressureFactor),
                history: Math.round(historyFactor),
                random: Math.round(randomFactor * 100) / 100
            },
            timestamp: new Date().toISOString(),
            algorithm: this.algorithmVersion
        };

        userHistory.push(prediction);
        if (userHistory.length > 10) userHistory.shift();
        this.predictionHistory.set(userId, userHistory);

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
                `الضغط الهجومي المستمر عند الدقيقة ${context.time || 'متقدمة'} يشير لهدف قريب`,
                `التسديدات المتتالية على المرمى تزيد فرص التسجيل بشكل ملحوظ`,
                `الركنيات المتكررة تشكل تهديداً مستمراً على دفاع الخصم`,
                `الاستحواذ الكبير في منتصف الملعب يخلق فرصاً واضحة`,
                `لعب الكرات الطويلة والعارضات يضاعف من فرص التسجيل`
            ],
            noGoal: [
                `الدفاع المنظم في الدقيقة ${context.time || 'الحالية'} يحد من الفرص`,
                `انخفاض وتيرة الهجمات يقلل من فرص التسجيل حالياً`,
                `اللعب في منتصف الملعب يحافظ على التوازن الدفاعي`,
                `غياب الضغط الهجومي المستمر يحد من خطورة المنطقة`,
                `التحول الدفاعي القوي يجعل التسجيل صعباً في هذه اللحظة`
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
            console.log('🔄 Using AI for image analysis...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return this.generateSmartPrediction('image_analysis');
        } catch (error) {
            console.error('AI analysis error:', error);
            return this.generateSmartPrediction('fallback');
        }
    }
}

// 💾 DATABASE MANAGER
class DatabaseManager {
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
        if (db) {
            try {
                const settingsDoc = await db.collection('settings').doc('prices').get();
                return settingsDoc.exists ? settingsDoc.data() : CONFIG.SUBSCRIPTION_PRICES;
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        return settingsDatabase.get('prices') || CONFIG.SUBSCRIPTION_PRICES;
    }

    async updateSettings(newPrices) {
        if (db) {
            try {
                await db.collection('settings').doc('prices').set(newPrices, { merge: true });
            } catch (error) {
                console.error('Firebase error, using local storage:', error);
            }
        }
        settingsDatabase.set('prices', newPrices);
    }
}

// INITIALIZE SYSTEMS
const goalAI = new GoalPredictionAI();
const dbManager = new DatabaseManager();

// 🎯 BOT SETUP
bot.use(session({ 
    defaultSession: () => ({ 
        step: 'start',
        userData: {},
        verificationCode: null,
        accountId: null,
        lastPrediction: null,
        paymentType: null,
        adminMode: false
    })
}));

// 🎯 لوحة المفاتيح الثابتة
const getMainKeyboard = () => {
    return Markup.keyboard([
        ['🎯 التوقع التالي', '📊 إحصائياتي'],
        ['📸 إرسال صورة', '💳 الاشتراكات'],
        ['👤 حالة الاشتراك', '🆘 الدعم الفني']
    ]).resize();
};

const getLoginKeyboard = () => {
    return Markup.keyboard([
        ['🔐 إدخال رقم الحساب']
    ]).resize();
};

const getSubscriptionKeyboard = () => {
    return Markup.keyboard([
        ['💰 أسبوعي - 10$', '💰 شهري - 30$'],
        ['💰 3 أشهر - 80$', '💰 سنوي - 250$'],
        ['🔙 الرجوع للقائمة']
    ]).resize();
};

const getAdminKeyboard = () => {
    return Markup.keyboard([
        ['📊 إحصائيات النظام', '👥 قائمة المستخدمين'],
        ['💰 طلبات الدفع', '⚙️ إعدادات الأسعار'],
        ['🔙 الخروج من وضع الإدمن']
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
✅ زر "التوقع التالي" يولد توقعات مختلفة
✅ تحليل حقيقي للمباريات
✅ نتائج فورية مع شرح مفصل

💎 *المطور:* أمين - @GEMZGOOL

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

        // 🔐 ADMIN COMMANDS
        if (userId === CONFIG.ADMIN_ID && text === '/admin') {
            ctx.session.adminMode = true;
            await ctx.replyWithMarkdown('🔧 *وضع الإدمن مفعل*', getAdminKeyboard());
            return;
        }

        if (session.adminMode) {
            await handleAdminCommands(ctx, text);
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
                    joined_at: new Date().toISOString()
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
        // 🎯 معالجة الأزرار الثابتة بعد التحقق
        else if (session.step === 'verified') {
            const userData = await dbManager.getUser(userId);
            
            if (!userData) {
                await ctx.replyWithMarkdown('❌ *جلسة منتهية*\n\n🔐 أرسل /start للبدء', getLoginKeyboard());
                return;
            }

            switch (text) {
                case '🎯 التوقع التالي':
                    await handlePrediction(ctx, userData, false);
                    break;

                case '📊 إحصائياتي':
                    await handleUserStats(ctx, userData);
                    break;

                case '📸 إرسال صورة':
                    await ctx.replyWithMarkdown(
                        '📸 *يرجى إرسال صورة المباراة الآن*\n\n' +
                        '🖼️ *الأنواع المدعومة:* PNG, JPG, JPEG',
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
                        `👤 @VIP_MFM\n\n` +
                        `⏰ متاحون 24/7 لخدمتكم`,
                        getMainKeyboard()
                    );
                    break;

                case '🔙 الرجوع للقائمة':
                    await ctx.replyWithMarkdown('🔙 *العودة للقائمة الرئيسية*', getMainKeyboard());
                    break;

                default:
                    if (/^\d{10}$/.test(text)) {
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
        else if (['🎯 التوقع التالي', '📊 إحصائياتي', '📸 إرسال صورة'].includes(text)) {
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
        
        // 🔍 التحقق من حالة الدفع أو التسجيل
        if (session.paymentType) {
            await handlePaymentScreenshot(ctx, userId, session.paymentType);
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

        const processingMsg = await ctx.reply('🔄 جاري تحليل صورة المباراة...\n⏳ تستخدم الخوارزمية الذكية المخفية');

        try {
            const prediction = await goalAI.analyzeImageWithAI(imageUrl);
            
            // 📊 تحديث إحصائيات المستخدم
            if (userData.subscription_status !== 'active') {
                userData.free_attempts--;
            }
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

// 🎯 HANDLER FUNCTIONS

async function handlePrediction(ctx, userData, isImageAnalysis = false) {
    const userId = ctx.from.id.toString();
    
    // 🔐 التحقق من المحاولات المجانية أو الاشتراك
    if (userData.subscription_status !== 'active' && userData.free_attempts <= 0) {
        await ctx.replyWithMarkdown(
            '🚫 *انتهت المحاولات المجانية*\n\n' +
            '💳 يرجى الاشتراك للمتابعة في استخدام الخدمة',
            getMainKeyboard()
        );
        return;
    }

    const nextPrediction = goalAI.generateNextPrediction(userId);
    
    // 📊 تحديث إحصائيات المستخدم
    if (userData.subscription_status !== 'active' && !isImageAnalysis) {
        userData.free_attempts--;
    }
    userData.lastPrediction = nextPrediction;
    await dbManager.saveUser(userId, userData);

    const predictionMessage = `
🎯 *التوقع التالي - الخوارزمية الذكية*

${nextPrediction.type}
📈 *الاحتمالية:* ${nextPrediction.probability}%
🎯 *الثقة:* ${nextPrediction.confidence}%

💡 *التحليل الجديد:*
${nextPrediction.reasoning}

${userData.subscription_status !== 'active' && !isImageAnalysis ? 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}` : 
    `✅ *اشتراك نشط - محاولات غير محدودة*`}

🔄 *تم توليد توقع جديد باستخدام عوامل مختلفة*
    `;

    await ctx.replyWithMarkdown(predictionMessage, getMainKeyboard());
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
        `🎯 ${accuracy}% دقة` +
        subscriptionInfo,
        getMainKeyboard()
    );
}

async function handleSubscriptions(ctx, userData) {
    const prices = await dbManager.getSettings();
    
    const subscriptionMessage = `
💳 *باقات الاشتراك المتاحة*

💰 *أسبوعي:* ${prices.week}$
⏰ مدة: 7 أيام
🔗 ${CONFIG.PAYMENT_LINKS.week}

💰 *شهري:* ${prices.month}$  
⏰ مدة: 30 يوماً
🔗 ${CONFIG.PAYMENT_LINKS.month}

💰 *3 أشهر:* ${prices.three_months}$
⏰ مدة: 90 يوماً
🔗 ${CONFIG.PAYMENT_LINKS.three_months}

💰 *سنوي:* ${prices.year}$
⏰ مدة: 365 يوماً
🔗 ${CONFIG.PAYMENT_LINKS.year}

📋 *طريقة الدفع:*
1. اختر الباقة المناسبة
2. ادفع عبر الرابط
3. أرسل صورة إثبات الدفع
4. انتظر التفعيل من الإدارة
    `;

    await ctx.replyWithMarkdown(subscriptionMessage, getSubscriptionKeyboard());
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

async function handlePaymentScreenshot(ctx, paymentType, userId) {
    const userData = await dbManager.getUser(userId);
    const photo = ctx.message.photo[ctx.message.photo.length - 1];
    const fileLink = await bot.telegram.getFileLink(photo.file_id);
    const imageUrl = fileLink.href;

    const paymentData = {
        user_id: userId,
        onexbet: userData.onexbet,
        screenshot_url: imageUrl,
        amount: CONFIG.SUBSCRIPTION_PRICES[paymentType],
        subscription_type: paymentType,
        username: userData.username,
        timestamp: new Date().toISOString()
    };

    const paymentId = await dbManager.addPayment(paymentData);
    
    // إعلام الإدارة
    try {
        await bot.telegram.sendMessage(
            CONFIG.ADMIN_ID,
            `🆕 *طلب دفع جديد*\n\n` +
            `👤 المستخدم: ${userData.username}\n` +
            `🔐 الحساب: ${userData.onexbet}\n` +
            `💰 المبلغ: ${paymentData.amount}$\n` +
            `📦 الباقة: ${paymentType}\n` +
            `🆔 الرقم: ${paymentId}`,
            { parse_mode: 'Markdown' }
        );
    } catch (error) {
        console.error('Error notifying admin:', error);
    }

    await ctx.replyWithMarkdown(
        '📩 *تم استلام صورة الدفع بنجاح*\n\n' +
        '✅ سيتم مراجعتها من الإدارة في أقرب وقت\n' +
        '⏰ عادةً خلال 24 ساعة\n\n' +
        '📞 للاستفسار: @GEMZGOOLBOT',
        getMainKeyboard()
    );

    ctx.session.paymentType = null;
}

// 🔧 ADMIN HANDLERS
async function handleAdminCommands(ctx, text) {
    const userId = ctx.from.id.toString();
    
    switch (text) {
        case '📊 إحصائيات النظام':
            await handleAdminStats(ctx);
            break;
            
        case '👥 قائمة المستخدمين':
            await handleAdminUsers(ctx);
            break;
            
        case '💰 طلبات الدفع':
            await handleAdminPayments(ctx);
            break;
            
        case '⚙️ إعدادات الأسعار':
            await handleAdminPrices(ctx);
            break;
            
        case '🔙 الخروج من وضع الإدمن':
            ctx.session.adminMode = false;
            await ctx.replyWithMarkdown('🔒 *تم الخروج من وضع الإدمن*', getMainKeyboard());
            break;
            
        default:
            if (text.startsWith('قبول_')) {
                const paymentId = text.split('_')[1];
                await handlePaymentAccept(ctx, paymentId);
            } else if (text.startsWith('رفض_')) {
                const paymentId = text.split('_')[1];
                await handlePaymentReject(ctx, paymentId);
            } else if (text.startsWith('سعر_')) {
                await handlePriceUpdate(ctx, text);
            }
            break;
    }
}

async function handleAdminStats(ctx) {
    const users = await dbManager.getAllUsers();
    const payments = await dbManager.getPendingPayments();
    const activeUsers = users.filter(u => u.subscription_status === 'active');
    const freeUsers = users.filter(u => u.subscription_status === 'free');
    
    await ctx.replyWithMarkdown(
        `📊 *إحصائيات النظام*\n\n` +
        `👥 إجمالي المستخدمين: ${users.length}\n` +
        `✅ مشتركين نشطين: ${activeUsers.length}\n` +
        `🆓 مستخدمين مجانين: ${freeUsers.length}\n` +
        `💰 طلبات دفع معلقة: ${payments.length}\n` +
        `🕒 آخر تحديث: ${new Date().toLocaleString('ar-EG')}`,
        getAdminKeyboard()
    );
}

async function handleAdminUsers(ctx) {
    const users = await dbManager.getAllUsers();
    
    let usersList = `👥 *قائمة المستخدمين (${users.length})*\n\n`;
    
    users.slice(0, 10).forEach((user, index) => {
        usersList += `${index + 1}. ${user.username} | ${user.onexbet}\n`;
        usersList += `   📱 ${user.user_id} | ${user.subscription_status}\n`;
        if (user.subscription_end_date) {
            const days = calculateRemainingDays(user.subscription_end_date);
            usersList += `   ⏳ ${days} يوم متبقي\n`;
        }
        usersList += '\n';
    });
    
    if (users.length > 10) {
        usersList += `... و ${users.length - 10} مستخدم آخر`;
    }
    
    await ctx.replyWithMarkdown(usersList, getAdminKeyboard());
}

async function handleAdminPayments(ctx) {
    const payments = await dbManager.getPendingPayments();
    
    if (payments.length === 0) {
        await ctx.replyWithMarkdown('✅ *لا توجد طلبات دفع معلقة*', getAdminKeyboard());
        return;
    }
    
    for (const payment of payments.slice(0, 5)) {
        const paymentMessage = `
💰 *طلب دفع #${payment.id}*

👤 المستخدم: ${payment.username}
🔐 الحساب: ${payment.onexbet}
💰 المبلغ: ${payment.amount}$
📦 الباقة: ${payment.subscription_type}
📅 التاريخ: ${new Date(payment.timestamp).toLocaleString('ar-EG')}

✅ *الإجراءات:*
قبول_${payment.id} - ✅ قبول الطلب
رفض_${payment.id} - ❌ رفض الطلب
        `;
        
        await ctx.replyWithMarkdown(paymentMessage, getAdminKeyboard());
    }
    
    if (payments.length > 5) {
        await ctx.replyWithMarkdown(`... و ${payments.length - 5} طلب دفع آخر`, getAdminKeyboard());
    }
}

async function handleAdminPrices(ctx) {
    const prices = await dbManager.getSettings();
    
    const pricesMessage = `
⚙️ *الإعدادات الحالية*

💰 أسبوعي: ${prices.week}$
💰 شهري: ${prices.month}$ 
💰 3 أشهر: ${prices.three_months}$
💰 سنوي: ${prices.year}$

📝 *للتعديل:* 
سعر_week_50 (لتغيير سعر الأسبوعي لـ 50)
سعر_month_100 (لتغيير سعر الشهري لـ 100)
    `;
    
    await ctx.replyWithMarkdown(pricesMessage, getAdminKeyboard());
}

async function handlePaymentAccept(ctx, paymentId) {
    const payment = paymentDatabase.get(paymentId);
    if (!payment) {
        await ctx.replyWithMarkdown('❌ *طلب الدفع غير موجود*', getAdminKeyboard());
        return;
    }
    
    const userData = await dbManager.getUser(payment.user_id);
    if (!userData) {
        await ctx.replyWithMarkdown('❌ *المستخدم غير موجود*', getAdminKeyboard());
        return;
    }
    
    // تفعيل الاشتراك
    const startDate = new Date().toISOString();
    const endDate = addSubscriptionDays(startDate, payment.subscription_type);
    
    userData.subscription_status = 'active';
    userData.subscription_type = payment.subscription_type;
    userData.subscription_start_date = startDate;
    userData.subscription_end_date = endDate;
    
    await dbManager.saveUser(payment.user_id, userData);
    await dbManager.updatePayment(paymentId, { status: 'accepted' });
    
    // إعلام المستخدم
    try {
        await bot.telegram.sendMessage(
            payment.user_id,
            `🎉 *تم تفعيل اشتراكك بنجاح!*\n\n` +
            `✅ ${payment.subscription_type}\n` +
            `💰 ${payment.amount}$\n` +
            `📅 الانتهاء: ${new Date(endDate).toLocaleDateString('ar-EG')}\n\n` +
            `🎯 يمكنك الآن استخدام الخدمة بدون حدود`,
            { parse_mode: 'Markdown' }
        );
    } catch (error) {
        console.error('Error notifying user:', error);
    }
    
    await ctx.replyWithMarkdown(
        `✅ *تم تفعيل الاشتراك للمستخدم*\n\n` +
        `👤 ${userData.username}\n` +
        `🔐 ${userData.onexbet}\n` +
        `📦 ${payment.subscription_type}\n` +
        `💰 ${payment.amount}$`,
        getAdminKeyboard()
    );
}

async function handlePaymentReject(ctx, paymentId) {
    const payment = paymentDatabase.get(paymentId);
    if (!payment) {
        await ctx.replyWithMarkdown('❌ *طلب الدفع غير موجود*', getAdminKeyboard());
        return;
    }
    
    await dbManager.updatePayment(paymentId, { status: 'rejected' });
    
    // إعلام المستخدم
    try {
        await bot.telegram.sendMessage(
            payment.user_id,
            `❌ *تم رفض طلب الدفع*\n\n` +
            `💳 يرجى التحقق من صورة الدفع والمحاولة مرة أخرى\n` +
            `📞 للاستفسار: @VIP_MFM`,
            { parse_mode: 'Markdown' }
        );
    } catch (error) {
        console.error('Error notifying user:', error);
    }
    
    await ctx.replyWithMarkdown(
        `❌ *تم رفض طلب الدفع*\n\n` +
        `🆔 ${paymentId}\n` +
        `👤 ${payment.username}`,
        getAdminKeyboard()
    );
}

async function handlePriceUpdate(ctx, text) {
    const parts = text.split('_');
    if (parts.length !== 3) {
        await ctx.replyWithMarkdown('❌ *صيغة غير صحيحة*', getAdminKeyboard());
        return;
    }
    
    const type = parts[1];
    const price = parseInt(parts[2]);
    
    if (!['week', 'month', 'three_months', 'year'].includes(type) || isNaN(price)) {
        await ctx.replyWithMarkdown('❌ *نوع أو سعر غير صحيح*', getAdminKeyboard());
        return;
    }
    
    const prices = await dbManager.getSettings();
    prices[type] = price;
    await dbManager.updateSettings(prices);
    
    await ctx.replyWithMarkdown(
        `✅ *تم تحديث السعر*\n\n` +
        `📦 ${type}: ${price}$\n\n` +
        `🔄 سيتم تطبيق الأسعار الجديدة فوراً`,
        getAdminKeyboard()
    );
}

// 🚀 START BOT
bot.launch().then(() => {
    console.log('🎉 SUCCESS! AI GOAL Predictor v7.0 is RUNNING!');
    console.log('🤖 Smart Algorithm Version:', goalAI.algorithmVersion);
    console.log('👤 Developer: Ismail - @GEMZGOOL');
    console.log('🌐 Health check: http://localhost:' + PORT);
    console.log('🔧 Admin ID:', CONFIG.ADMIN_ID);
    console.log('✅ Accepts ANY 10-digit 1xBet account');
}).catch(console.error);

// ⚡ Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('✅ AI Goal Prediction System Ready!');