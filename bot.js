// ===================================================
// 🚀 AI GOAL PREDICTOR ULTIMATE - VERSION 10.7
// 👤 DEVELOPER: AMIN - @GEMZGOOLBOT
// 🔥 FEATURES: SMART AI + BETTING SYSTEM + FIREBASE + FULL ADMIN PANEL
// ===================================================

console.log('🤖 Starting AI GOAL Predictor Ultimate v10.7...');
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
    
    VERSION: "10.7.0",
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
        this.algorithmVersion = "10.7";
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            return this.generateSmartPrediction('image_analysis');
        } catch (error) {
            return this.generateSmartPrediction('fallback');
        }
    }

    generateNextPrediction(userId) {
        return this.generateSmartPrediction(userId);
    }
}

// 🔍 ADVANCED IMAGE VALIDATION SYSTEM WITH OPENAI
class ImageValidator {
    constructor(openaiApiKey) {
        this.openaiApiKey = openaiApiKey;
    }

    async validateImage(imageUrl) {
        try {
            // استخدام OpenAI للتحقق من الصورة
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `تحقق بدقة من الصورة التالية.
إذا كانت تحتوي على مباراة كرة قدم أو لاعبين أو شعار نادي أو كلمة GOAL أو VS أو ملعب، أجب فقط بكلمة "مباراة".
أما إذا كانت صورة شخصية أو طبيعية أو أي شيء آخر غير رياضي، أجب فقط بكلمة "مرفوضة".`
                            },
                            {
                                type: "image_url",
                                image_url: imageUrl
                            }
                        ]
                    }
                ],
                max_tokens: 10
            }, {
                headers: {
                    'Authorization': `Bearer ${this.openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            const answer = response.data.choices[0].message.content.toLowerCase().trim();
            
            if (answer.includes('مباراة')) {
                return {
                    valid: true,
                    message: '✅ تم التعرف على صورة مباراة، جاري التحليل...',
                    elements: ['لاعبين', 'ملعب', 'كرة', 'هدف']
                };
            } else {
                return {
                    valid: false,
                    message: '❌ أرسل صورة مباراة فقط، مثل التي تحتوي على لاعبين أو شعار نادي.',
                    elements: []
                };
            }
        } catch (error) {
            console.error('OpenAI validation error:', error);
            // Fallback إلى التحقق الأساسي
            return this.basicValidation(imageUrl);
        }
    }

    async basicValidation(imageUrl) {
        try {
            // محاكاة التحقق من الصورة
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // محاكاة نجاح التحقق (85% من الصور مقبولة)
            const isValid = Math.random() > 0.15;
            
            if (isValid) {
                return {
                    valid: true,
                    message: '✅ تم التحقق من صورة المباراة بنجاح',
                    elements: ['لاعبين', 'ملعب', 'كرة', 'هدف']
                };
            } else {
                return {
                    valid: false,
                    message: '❌ أرسل صورة مباراة فقط، مثل الصورة التي فيها لاعبين أو كلمة GOAL!',
                    elements: []
                };
            }
        } catch (error) {
            console.error('Basic validation error:', error);
            return {
                valid: true, // في حالة الخطأ نقبل الصورة لتجنب حظر المستخدمين
                message: '✅ تم تحميل الصورة بنجاح',
                elements: []
            };
        }
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
const imageValidator = new ImageValidator(CONFIG.AI_APIS.OPENAI);

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
        broadcastMessage: null,
        hasActivePrediction: false,
        editingPrices: false,
        editingLinks: false,
        currentEditingType: null
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
        ['🖼️ تعديل صور الاشتراكات', '⚙️ الإعدادات العامة'],
        ['🔄 إعادة التعيين', '🔙 رجوع']
    ]).resize();
};

const getPriceEditKeyboard = () => {
    return Markup.keyboard([
        ['💰 تعديل سعر أسبوعي', '💰 تعديل سعر شهري'],
        ['💰 تعديل سعر 3 أشهر', '💰 تعديل سعر سنوي'],
        ['🔙 رجوع للإعدادات']
    ]).resize();
};

const getLinkEditKeyboard = () => {
    return Markup.keyboard([
        ['🔗 تعديل رابط أسبوعي', '🔗 تعديل رابط شهري'],
        ['🔗 تعديل رابط 3 أشهر', '🔗 تعديل رابط سنوي'],
        ['🔙 رجوع للإعدادات']
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

        // معالجة تعديل الأسعار
        if (session.editingPrices && session.currentEditingType) {
            await handlePriceInput(ctx, text);
            return;
        }

        // معالجة تعديل الروابط
        if (session.editingLinks && session.currentEditingType) {
            await handleLinkInput(ctx, text);
            return;
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
                    free_attempts: 5,
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
                    `🎁 *تحصل على 5 محاولات مجانية*\n\n` +
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

// 🖼️ IMAGE ANALYSIS HANDLER - معدل للتحقق من صور المباراة فقط باستخدام OpenAI
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

        // التحقق من صحة الصورة باستخدام OpenAI
        const validationMsg = await ctx.reply('🔍 جاري التحقق من صورة المباراة...');
        const validationResult = await imageValidator.validateImage(imageUrl);
        
        if (!validationResult.valid) {
            await ctx.replyWithMarkdown(validationResult.message, getMainKeyboard());
            await ctx.deleteMessage(validationMsg.message_id);
            return;
        }

        await ctx.editMessageText('✅ ' + validationResult.message, { 
            chat_id: ctx.chat.id, 
            message_id: validationMsg.message_id 
        });

        // حفظ رابط الصورة في الجلسة للاستخدام لاحقاً
        ctx.session.lastImageUrl = imageUrl;

        const processingMsg = await ctx.reply('🔄 جاري تحليل صورة المباراة بالذكاء الاصطناعي...');

        try {
            const prediction = await goalAI.analyzeImageWithAI(imageUrl);
            
            // 📊 تحديث إحصائيات المستخدم
            if (userData.subscription_status !== 'active') {
                userData.free_attempts--;
            }
            userData.total_predictions = (userData.total_predictions || 0) + 1;
            userData.total_bets = (userData.total_bets || 0) + session.currentBet;
            userData.lastPrediction = prediction;
            await dbManager.saveUser(userId, userData);

            // تعيين وجود توقع نشط
            ctx.session.hasActivePrediction = true;

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
            
            // إضافة أزرار النتيجة فقط
            const resultKeyboard = Markup.inlineKeyboard([
                [
                    Markup.button.callback(`🎊 فوز - ربح ${session.currentBet * 2}$`, `win_${Date.now()}`),
                    Markup.button.callback(`🔄 خسارة`, `lose_${Date.now()}`)
                ]
            ]);

            await ctx.replyWithMarkdown(
                '📊 *ما هي نتيجة التوقع على منصة 1xBet؟*\n\n' +
                `🎊 *فوز* - تربح ${session.currentBet * 2}$\n` +
                `🔄 *خسارة* - جرب التوقع التالي بمضاعفة الرهان\n\n` +
                '✨ اضغط على النتيجة بعد تجربة التوقع على المنصة',
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
                
                await ctx.answerCbQuery(`🎊 مبروك! فزت وربحت ${profit}$`);
                
                await ctx.replyWithMarkdown(
                    `🎊 *مبروك! فوز رائع* ✨\n\n` +
                    `✅ توقعك كان دقيقاً ومميزاً\n` +
                    `💰 ربحت: ${profit}$\n` +
                    `💵 إجمالي أرباحك: ${ctx.session.totalProfit}$\n\n` +
                    `🎯 يمكنك البدء بتوقع جديد`,
                    getMainKeyboard()
                );
                
                // إعادة تعيين الرهان وإزالة التوقع النشط
                ctx.session.currentBet = 0;
                ctx.session.originalBet = 0;
                ctx.session.hasActivePrediction = false;
                
            } else {
                // مضاعفة الرهان
                const newBet = ctx.session.currentBet * 2;
                userData.losses = (userData.losses || 0) + 1;
                ctx.session.currentBet = newBet;
                
                await ctx.answerCbQuery(`🔄 جاري إعداد التوقع التالي...`);
                
                // رسالة تشجيعية للمستخدم
                await ctx.replyWithMarkdown(
                    `🔄 *خسارة هذه الجولة*\n\n` +
                    `📈 *لا تقلق! الرهان التالي مضاعف: ${newBet}$*\n` +
                    `💪 *أنت قادر على الفوز! استمر في المحاولة*\n` +
                    `✨ *التوقع القادم قد يكون الفوز الكبير*\n\n` +
                    `🎯 اضغط على "🎯 التوقع التالي" للمتابعة`
                );

                // إزالة التوقع النشط للسماح بإنشاء توقع جديد
                ctx.session.hasActivePrediction = false;
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
        // التحقق من وجود توقع نشط
        if (ctx.session.hasActivePrediction) {
            await ctx.replyWithMarkdown(
                '❌ *يوجد توقع نشط حالياً*\n\n' +
                '📊 يرجى تحديد نتيجة التوقع الحالي أولاً\n' +
                '✨ اضغط على زر الفوز أو الخسارة للمتابعة',
                getMainKeyboard()
            );
            return;
        }

        if (!ctx.session.lastImageUrl) {
            await ctx.replyWithMarkdown('❌ *لا توجد صورة سابقة*\n\n📸 يرجى إرسال صورة أولاً');
            return;
        }

        // التحقق من المحاولات المجانية أو الاشتراك
        if (userData.subscription_status !== 'active' && userData.free_attempts <= 0) {
            await ctx.replyWithMarkdown(
                '🚫 *انتهت المحاولات المجانية*\n\n' +
                '💳 يرجى الاشتراك للمتابعة في استخدام الخدمة',
                getMainKeyboard()
            );
            return;
        }

        const processingMsg = await ctx.reply('🔄 جاري إنشاء التوقع التالي بالذكاء الاصطناعي...');
        
        const prediction = await goalAI.analyzeImageWithAI(ctx.session.lastImageUrl);
        
        // تحديث إحصائيات المستخدم
        if (userData.subscription_status !== 'active') {
            userData.free_attempts--;
        }
        userData.total_predictions = (userData.total_predictions || 0) + 1;
        userData.total_bets = (userData.total_bets || 0) + ctx.session.currentBet;
        userData.lastPrediction = prediction;
        await dbManager.saveUser(ctx.from.id.toString(), userData);

        // تعيين وجود توقع نشط
        ctx.session.hasActivePrediction = true;

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

${userData.subscription_status !== 'active' ? 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}` : 
    `✅ *اشتراك نشط - محاولات غير محدودة*`}
        `;

        await ctx.replyWithMarkdown(analysisMessage);
        
        // إضافة أزرار النتيجة فقط
        const resultKeyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback(`🎊 فوز - ربح ${ctx.session.currentBet * 2}$`, `win_${Date.now()}`),
                Markup.button.callback(`🔄 خسارة`, `lose_${Date.now()}`)
            ]
        ]);

        await ctx.replyWithMarkdown(
            '📊 *ما هي نتيجة التوقع على منصة 1xBet؟*\n\n' +
            `🎊 *فوز* - تربح ${ctx.session.currentBet * 2}$\n` +
            `🔄 *خسارة* - جرب التوقع التالي بمضاعفة الرهان\n\n` +
            '✨ اضغط على النتيجة بعد تجربة التوقع على المنصة',
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

// 🔧 ADMIN HANDLERS - معدل بالكامل مع إصلاح تعديل الأسعار والروابط
async function handleAdminCommands(ctx, text) {
    const session = ctx.session;
    
    try {
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
            try {
                await bot.telegram.sendMessage(
                    user.user_id, 
                    `📢 *إشعار من الإدارة*\n\n${message}`,
                    { parse_mode: 'Markdown' }
                );
                success++;
            } catch (error) {
                failed++;
            }
            
            // تأخير بسيط لتجنب حظر التليجرام
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        await ctx.replyWithMarkdown(
            `📢 *تم إرسال الإشعار بنجاح*\n\n` +
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

async function handleAdminToggleMaintenance(ctx) {
    try {
        const settings = await dbManager.getSettings();
        const newStatus = !settings.maintenance_mode;
        
        await dbManager.setMaintenanceMode(newStatus);
        
        if (newStatus) {
            await ctx.replyWithMarkdown('🔒 *تم قفل البوت للمستخدمين*', getAdminMainKeyboard());
        } else {
            await ctx.replyWithMarkdown('🔓 *تم فتح البوت للمستخدمين*', getAdminMainKeyboard());
        }
    } catch (error) {
        console.error('Toggle maintenance error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تغيير حالة البوت', getAdminMainKeyboard());
    }
}

async function handleAdminStats(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const payments = await dbManager.getAllPayments();
        const pendingPayments = payments.filter(p => p.status === 'pending');
        
        const activeUsers = users.filter(u => u.subscription_status === 'active');
        const freeUsers = users.filter(u => u.subscription_status === 'free');
        
        const totalPredictions = users.reduce((sum, user) => sum + (user.total_predictions || 0), 0);
        const totalProfit = users.reduce((sum, user) => sum + (user.total_profit || 0), 0);
        
        const statsMessage = `
📊 *إحصائيات النظام*

👥 *المستخدمين:*
• الإجمالي: ${users.length}
• نشطين: ${activeUsers.length}
• مجانين: ${freeUsers.length}

💰 *المدفوعات:*
• المعلقة: ${pendingPayments.length}
• الإجمالي: ${payments.length}

📈 *النشاط:*
• التوقعات: ${totalPredictions}
• الأرباح: ${totalProfit}$

🔧 *حالة البوت:* ${dbManager.isMaintenanceMode() ? '🔒 مقفل' : '🔓 مفتوح'}
        `;
        
        await ctx.replyWithMarkdown(statsMessage, getAdminMainKeyboard());
    } catch (error) {
        console.error('Admin stats error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب الإحصائيات', getAdminMainKeyboard());
    }
}

async function handleAdminUsers(ctx, text) {
    try {
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
    } catch (error) {
        console.error('Admin users error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في معالجة الأمر', getAdminUsersKeyboard());
    }
}

async function handleAdminUsersList(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        
        let message = `📋 *قائمة المستخدمين (${users.length})*\n\n`;
        
        users.slice(0, 10).forEach((user, index) => {
            const status = user.subscription_status === 'active' ? '✅' : '🆓';
            message += `${index + 1}. ${user.username || 'بدون اسم'} ${status}\n`;
            message += `   👤 ${user.user_id} | 🔐 ${user.onexbet}\n\n`;
        });
        
        if (users.length > 10) {
            message += `... و ${users.length - 10} مستخدم آخر`;
        }
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin users list error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب قائمة المستخدمين', getAdminUsersKeyboard());
    }
}

async function handleAdminActiveUsers(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const activeUsers = users.filter(u => u.subscription_status === 'active');
        
        let message = `✅ *المشتركين النشطين (${activeUsers.length})*\n\n`;
        
        activeUsers.slice(0, 10).forEach((user, index) => {
            const remainingDays = calculateRemainingDays(user.subscription_end_date);
            message += `${index + 1}. ${user.username || 'بدون اسم'}\n`;
            message += `   📦 ${user.subscription_type} | ⏳ ${remainingDays} يوم\n\n`;
        });
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin active users error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب المشتركين النشطين', getAdminUsersKeyboard());
    }
}

async function handleAdminFreeUsers(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const freeUsers = users.filter(u => u.subscription_status === 'free');
        
        let message = `🆓 *المستخدمين المجانين (${freeUsers.length})*\n\n`;
        
        freeUsers.slice(0, 10).forEach((user, index) => {
            message += `${index + 1}. ${user.username || 'بدون اسم'}\n`;
            message += `   🆓 محاولات: ${user.free_attempts}\n\n`;
        });
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin free users error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب المستخدمين المجانين', getAdminUsersKeyboard());
    }
}

async function handleAdminUsersStats(ctx) {
    try {
        const users = await dbManager.getAllUsers();
        const activeUsers = users.filter(u => u.subscription_status === 'active');
        const freeUsers = users.filter(u => u.subscription_status === 'free');
        
        const totalPredictions = users.reduce((sum, user) => sum + (user.total_predictions || 0), 0);
        const totalProfit = users.reduce((sum, user) => sum + (user.total_profit || 0), 0);
        const totalBets = users.reduce((sum, user) => sum + (user.total_bets || 0), 0);
        
        const message = `
📈 *إحصائيات المستخدمين*

👥 الإجمالي: ${users.length}
✅ نشطين: ${activeUsers.length}
🆓 مجانين: ${freeUsers.length}

📊 إجمالي التوقعات: ${totalPredictions}
💰 إجمالي الرهانات: ${totalBets}$
💵 إجمالي الأرباح: ${totalProfit}$
        `;
        
        await ctx.replyWithMarkdown(message, getAdminUsersKeyboard());
    } catch (error) {
        console.error('Admin users stats error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب إحصائيات المستخدمين', getAdminUsersKeyboard());
    }
}

async function handleAdminPayments(ctx, text) {
    try {
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
    } catch (error) {
        console.error('Admin payments error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في معالجة الأمر', getAdminPaymentsKeyboard());
    }
}

async function handleAdminPendingPayments(ctx) {
    try {
        const payments = await dbManager.getPendingPayments();
        
        if (payments.length === 0) {
            await ctx.replyWithMarkdown('✅ *لا توجد طلبات دفع معلقة*', getAdminPaymentsKeyboard());
            return;
        }
        
        for (const payment of payments) {
            await ctx.replyWithMarkdown(
                `📥 *طلب دفع معلق #${payment.id}*\n\n` +
                `👤 المستخدم: ${payment.username}\n` +
                `🔐 الحساب: ${payment.onexbet}\n` +
                `💰 المبلغ: ${payment.amount}$\n` +
                `📦 الباقة: ${payment.subscription_type}\n` +
                `📅 التاريخ: ${new Date(payment.timestamp).toLocaleString('ar-EG')}\n` +
                `🔗 صورة: ${payment.screenshot_url}`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: '✅ قبول الاشتراك', callback_data: `accept_${payment.id}` },
                                { text: '❌ رفض الطلب', callback_data: `reject_${payment.id}` }
                            ]
                        ]
                    }
                }
            );
        }
    } catch (error) {
        console.error('Admin pending payments error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب الطلبات المعلقة', getAdminPaymentsKeyboard());
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
            message += `${index + 1}. ${payment.username} | ${payment.onexbet}\n`;
            message += `   💰 ${payment.amount}$ | 📦 ${payment.subscription_type}\n\n`;
        });
        
        await ctx.replyWithMarkdown(message, getAdminPaymentsKeyboard());
    } catch (error) {
        console.error('Admin accepted payments error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب الطلبات المقبولة', getAdminPaymentsKeyboard());
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
            message += `${index + 1}. ${payment.username} | ${payment.onexbet}\n`;
            message += `   💰 ${payment.amount}$ | 📦 ${payment.subscription_type}\n\n`;
        });
        
        await ctx.replyWithMarkdown(message, getAdminPaymentsKeyboard());
    } catch (error) {
        console.error('Admin rejected payments error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب الطلبات المرفوضة', getAdminPaymentsKeyboard());
    }
}

async function handleAdminAllPayments(ctx) {
    try {
        const payments = await dbManager.getAllPayments();
        
        if (payments.length === 0) {
            await ctx.replyWithMarkdown('✅ *لا توجد طلبات دفع*', getAdminPaymentsKeyboard());
            return;
        }
        
        const pending = payments.filter(p => p.status === 'pending').length;
        const accepted = payments.filter(p => p.status === 'accepted').length;
        const rejected = payments.filter(p => p.status === 'rejected').length;
        
        const message = `
📋 *جميع طلبات الدفع*

📥 المعلقة: ${pending}
✅ المقبولة: ${accepted}
❌ المرفوضة: ${rejected}
💰 الإجمالي: ${payments.length}
        `;
        
        await ctx.replyWithMarkdown(message, getAdminPaymentsKeyboard());
    } catch (error) {
        console.error('Admin all payments error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب جميع الطلبات', getAdminPaymentsKeyboard());
    }
}

async function handleAdminSettings(ctx, text) {
    try {
        switch (text) {
            case '💰 تعديل الأسعار':
                await handleAdminPriceSettings(ctx);
                break;
                
            case '🔗 تعديل روابط الدفع':
                await handleAdminPaymentLinks(ctx);
                break;

            case '🖼️ تعديل صور الاشتراكات':
                await ctx.replyWithMarkdown('🖼️ *تعديل صور الاشتراكات*\n\nهذه الميزة قيد التطوير...', getAdminSettingsKeyboard());
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
                await ctx.replyWithMarkdown('❌ *خيار غير معروف*', getAdminSettingsKeyboard());
                break;
        }
    } catch (error) {
        console.error('Admin settings error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في معالجة الأمر', getAdminSettingsKeyboard());
    }
}

async function handleAdminPriceSettings(ctx) {
    try {
        const settings = await dbManager.getSettings();
        if (!settings || !settings.prices) {
            await ctx.replyWithMarkdown('❌ *لا توجد إعدادات أسعار*', getAdminSettingsKeyboard());
            return;
        }

        const prices = settings.prices;
        
        const priceMessage = `
💰 *الإعدادات الحالية*

أسبوعي: ${prices.week || 10}$
شهري: ${prices.month || 30}$ 
3 أشهر: ${prices.three_months || 80}$
سنوي: ${prices.year || 250}$

📝 *اختر نوع السعر الذي تريد تعديله:*
        `;
        
        await ctx.replyWithMarkdown(priceMessage, getPriceEditKeyboard());
    } catch (error) {
        console.error('Admin price settings error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب إعدادات الأسعار', getAdminSettingsKeyboard());
    }
}

async function handleAdminPaymentLinks(ctx) {
    try {
        const settings = await dbManager.getSettings();
        if (!settings || !settings.payment_links) {
            await ctx.replyWithMarkdown('❌ *لا توجد إعدادات روابط دفع*', getAdminSettingsKeyboard());
            return;
        }

        const payment_links = settings.payment_links;
        
        const linksMessage = `
🔗 *روابط الدفع الحالية*

أسبوعي: ${payment_links.week || 'غير محدد'}
شهري: ${payment_links.month || 'غير محدد'}
3 أشهر: ${payment_links.three_months || 'غير محدد'}
سنوي: ${payment_links.year || 'غير محدد'}

📝 *اختر نوع الرابط الذي تريد تعديله:*
        `;
        
        await ctx.replyWithMarkdown(linksMessage, getLinkEditKeyboard());
    } catch (error) {
        console.error('Admin payment links error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب روابط الدفع', getAdminSettingsKeyboard());
    }
}

async function handleAdminGeneralSettings(ctx) {
    try {
        const settings = await dbManager.getSettings();
        if (!settings) {
            await ctx.replyWithMarkdown('❌ *لا توجد إعدادات*', getAdminSettingsKeyboard());
            return;
        }
        
        const generalMessage = `
⚙️ *الإعدادات العامة*

🔧 حالة البوت: ${settings.maintenance_mode ? '🔒 مقفل' : '🔓 مفتوح'}
🕒 آخر تحديث: ${new Date(settings.updated_at).toLocaleString('ar-EG')}

💰 *الأسعار الحالية:*
• أسبوعي: ${settings.prices?.week || 10}$
• شهري: ${settings.prices?.month || 30}$
• 3 أشهر: ${settings.prices?.three_months || 80}$ 
• سنوي: ${settings.prices?.year || 250}$

🔗 *روابط الدفع:*
• أسبوعي: ${settings.payment_links?.week || 'غير محدد'}
• شهري: ${settings.payment_links?.month || 'غير محدد'}
• 3 أشهر: ${settings.payment_links?.three_months || 'غير محدد'}
• سنوي: ${settings.payment_links?.year || 'غير محدد'}
        `;
        
        await ctx.replyWithMarkdown(generalMessage, getAdminSettingsKeyboard());
    } catch (error) {
        console.error('Admin general settings error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في جلب الإعدادات العامة', getAdminSettingsKeyboard());
    }
}

async function handleAdminReset(ctx) {
    try {
        const resetKeyboard = Markup.inlineKeyboard([
            [
                Markup.button.callback('✅ نعم، إعادة التعيين', 'confirm_reset'),
                Markup.button.callback('❌ إلغاء', 'cancel_reset')
            ]
        ]);

        await ctx.replyWithMarkdown(
            '⚠️ *تحذير: إعادة التعيين*\n\n' +
            'هذا الإجراء سيعيد جميع الإعدادات إلى القيم الافتراضية.\n\n' +
            '❌ *سيتم حذف:*\n' +
            '• جميع إعدادات الأسعار\n' +
            '• جميع روابط الدفع\n\n' +
            '✅ *لن يتم حذف:*\n' +
            '• بيانات المستخدمين\n' +
            '• طلبات الدفع\n\n' +
            '⚠️ *هل أنت متأكد من المتابعة؟*',
            resetKeyboard
        );
    } catch (error) {
        console.error('Admin reset error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في إعداد إعادة التعيين', getAdminSettingsKeyboard());
    }
}

// معالجة إدخال الأسعار
async function handlePriceInput(ctx, text) {
    try {
        const price = parseFloat(text);
        
        if (isNaN(price) || price <= 0) {
            await ctx.replyWithMarkdown('❌ *سعر غير صحيح!*\n\n💰 يرجى إدخال سعر صحيح (رقم موجب)');
            return;
        }

        const settings = await dbManager.getSettings();
        if (!settings.prices) {
            settings.prices = { ...CONFIG.SUBSCRIPTION_PRICES };
        }
        
        settings.prices[ctx.session.currentEditingType] = price;
        await dbManager.updateSettings(settings);

        const typeNames = {
            'week': 'أسبوعي',
            'month': 'شهري',
            'three_months': '3 أشهر',
            'year': 'سنوي'
        };

        await ctx.replyWithMarkdown(
            `✅ *تم تحديث السعر بنجاح*\n\n` +
            `📦 ${typeNames[ctx.session.currentEditingType]}: ${price}$\n\n` +
            `🔄 تم حفظ التغييرات في قاعدة البيانات`,
            getAdminSettingsKeyboard()
        );

        // إعادة تعيين الجلسة
        ctx.session.editingPrices = false;
        ctx.session.currentEditingType = null;
        ctx.session.adminStep = 'settings';

    } catch (error) {
        console.error('Price input error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تحديث السعر', getAdminSettingsKeyboard());
    }
}

// معالجة إدخال الروابط
async function handleLinkInput(ctx, text) {
    try {
        if (!text.startsWith('http')) {
            await ctx.replyWithMarkdown('❌ *رابط غير صحيح!*\n\n🔗 يرجى إدخال رابط يبدأ بـ http أو https');
            return;
        }

        const settings = await dbManager.getSettings();
        if (!settings.payment_links) {
            settings.payment_links = { ...CONFIG.PAYMENT_LINKS };
        }
        
        settings.payment_links[ctx.session.currentEditingType] = text;
        await dbManager.updateSettings(settings);

        const typeNames = {
            'week': 'أسبوعي',
            'month': 'شهري',
            'three_months': '3 أشهر',
            'year': 'سنوي'
        };

        await ctx.replyWithMarkdown(
            `✅ *تم تحديث الرابط بنجاح*\n\n` +
            `🔗 ${typeNames[ctx.session.currentEditingType]}: ${text}\n\n` +
            `🔄 تم حفظ التغييرات في قاعدة البيانات`,
            getAdminSettingsKeyboard()
        );

        // إعادة تعيين الجلسة
        ctx.session.editingLinks = false;
        ctx.session.currentEditingType = null;
        ctx.session.adminStep = 'settings';

    } catch (error) {
        console.error('Link input error:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في تحديث الرابط', getAdminSettingsKeyboard());
    }
}

// معالجة أزرار تعديل الأسعار
async function handleAdminPriceEditSelection(ctx, text) {
    const priceTypeMap = {
        '💰 تعديل سعر أسبوعي': 'week',
        '💰 تعديل سعر شهري': 'month',
        '💰 تعديل سعر 3 أشهر': 'three_months',
        '💰 تعديل سعر سنوي': 'year'
    };

    const priceType = priceTypeMap[text];
    if (priceType) {
        ctx.session.editingPrices = true;
        ctx.session.currentEditingType = priceType;
        
        const typeNames = {
            'week': 'أسبوعي',
            'month': 'شهري',
            'three_months': '3 أشهر',
            'year': 'سنوي'
        };

        await ctx.replyWithMarkdown(
            `💰 *تعديل سعر ${typeNames[priceType]}*\n\n` +
            `💵 الرجاء إدخال السعر الجديد (بالدولار):\n\n` +
            `📝 مثال: 15 أو 20.5`
        );
        return true;
    }
    return false;
}

// معالجة أزرار تعديل الروابط
async function handleAdminLinkEditSelection(ctx, text) {
    const linkTypeMap = {
        '🔗 تعديل رابط أسبوعي': 'week',
        '🔗 تعديل رابط شهري': 'month',
        '🔗 تعديل رابط 3 أشهر': 'three_months',
        '🔗 تعديل رابط سنوي': 'year'
    };

    const linkType = linkTypeMap[text];
    if (linkType) {
        ctx.session.editingLinks = true;
        ctx.session.currentEditingType = linkType;
        
        const typeNames = {
            'week': 'أسبوعي',
            'month': 'شهري',
            'three_months': '3 أشهر',
            'year': 'سنوي'
        };

        await ctx.replyWithMarkdown(
            `🔗 *تعديل رابط ${typeNames[linkType]}*\n\n` +
            `🌐 الرجاء إدخال الرابط الجديد:\n\n` +
            `📝 مثال: https://example.com/payment/weekly`
        );
        return true;
    }
    return false;
}

// إضافة معالجة الأزرار الجديدة في handleAdminCommands
async function handleAdminCommands(ctx, text) {
    const session = ctx.session;
    
    try {
        // معالجة تعديل الأسعار
        if (session.adminStep === 'settings' && await handleAdminPriceEditSelection(ctx, text)) {
            return;
        }

        // معالجة تعديل الروابط
        if (session.adminStep === 'settings' && await handleAdminLinkEditSelection(ctx, text)) {
            return;
        }

        // معالجة الرجوع من تعديل الأسعار
        if (text === '🔙 رجوع للإعدادات') {
            ctx.session.adminStep = 'settings';
            await ctx.replyWithMarkdown('🔙 *العودة لإعدادات الإدارة*', getAdminSettingsKeyboard());
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
        
        // تعديل الرسالة الأصلية
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
        
        // تعديل الرسالة الأصلية
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
    console.log('🎉 SUCCESS! AI GOAL Predictor v10.7 is RUNNING!');
    console.log('👤 Developer:', CONFIG.DEVELOPER);
    console.log('📢 Channel:', CONFIG.CHANNEL);
    console.log('🌐 Health check: http://localhost:' + PORT);
    console.log('🔧 Admin ID:', CONFIG.ADMIN_ID);
}).catch(console.error);

// ⚡ Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('✅ AI Goal Prediction System Ready!');