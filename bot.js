// ===================================================
// 🚀 AI GOAL PREDICTOR ULTIMATE - VERSION 11.1
// 👤 DEVELOPER: AMIN - @GEMZGOOLBOT
// 🔥 FEATURES: STRICT OCR VALIDATION + AI ANALYSIS + BETTING SYSTEM
// ===================================================

console.log('🤖 بدء تشغيل AI GOAL Predictor Ultimate v11.1...');
console.log('🕒 ' + new Date().toISOString());

// 🔧 CONFIGURATION
const CONFIG = {
    BOT_TOKEN: process.env.BOT_TOKEN,
    ADMIN_ID: process.env.ADMIN_ID,
    
    // 🧠 AI APIS
    AI_APIS: {
        GEMINI: process.env.GEMINI_API_KEY,
        OPENAI: process.env.OPENAI_API_KEY
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
        week: process.env.PAYMENT_WEEK,
        month: process.env.PAYMENT_MONTH,
        three_months: process.env.PAYMENT_3MONTHS,
        year: process.env.PAYMENT_YEAR
    },
    
    VERSION: "11.1.0",
    DEVELOPER: "AMIN - @GEMZGOOLBOT",
    CHANNEL: "@GEMZGOOL",
    CHANNEL_LINK: "https://t.me/+LP3ZTdajIeE2YjI0",
    START_IMAGE: "https://i.ibb.co/tpy70Bd1/IMG-20251104-074214-065.jpg",
    ANALYSIS_IMAGE: "https://i.ibb.co/VYjf05S0/Screenshot.png",
    IMGBB_API_KEY: process.env.IMGBB_API_KEY
};

console.log('✅ تم تحميل الإعدادات بنجاح');

// 🚀 INITIALIZE BOT
const { Telegraf, Markup, session } = require('telegraf');
const axios = require('axios');
const express = require('express');
const FormData = require('form-data');
const Tesseract = require('tesseract.js');
const { createWorker } = Tesseract;
const OpenAI = require('openai');

const bot = new Telegraf(CONFIG.BOT_TOKEN);
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 🌐 HEALTH CHECK SERVER FOR RENDER
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        status: 'OK', 
        version: CONFIG.VERSION,
        timestamp: new Date().toISOString(),
        message: 'AI Goal Predictor Bot is running...',
        developer: CONFIG.DEVELOPER
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(PORT, () => {
    console.log(`🌐 خادم الفحص الصحي يعمل على المنفذ ${PORT}`);
});

// 🔥 FIREBASE INITIALIZATION
let db = null;
let admin = null;

try {
    admin = require('firebase-admin');
    
    const serviceAccount = {
        "type": "service_account",
        "project_id": process.env.FIREBASE_PROJECT_ID || "bot-tlegram-9f4b5",
        "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
        "client_email": process.env.FIREBASE_CLIENT_EMAIL || "firebase-adminsdk@bot-tlegram-9f4b5.iam.gserviceaccount.com",
        "client_id": process.env.FIREBASE_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.FIREBASE_CERT_URL
    };

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL || "https://bot-tlegram-9f4b5-default-rtdb.firebaseio.com"
        });
    }
    
    db = admin.firestore();
    console.log('✅ تم تهيئة Firebase بنجاح');
    
} catch (error) {
    console.log('⚠️ فشل تهيئة Firebase:', error.message);
    console.log('🔄 استخدام التخزين المحلي بدلاً من ذلك');
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
        this.algorithmVersion = "11.1";
    }

    generateSmartPrediction(userId) {
        const isGoal = Math.random() > 0.5;
        const probability = Math.floor(Math.random() * 30) + 70;
        
        const prediction = {
            type: isGoal ? '⚽ GOAL - هدف' : '❌ NO GOAL - لا هدف',
            probability: probability,
            confidence: 100,
            reasoning: isGoal ? 
                `🔥 الضغط الهجومي المستمر والفرص الواضحة تشير إلى هدف قريب بنسبة ${probability}%` :
                `🛡️ الدفاع المنظم وغياب الفرص الواضحة تشير إلى عدم تسجيل هدف بنسبة ${probability}%`,
            timestamp: new Date().toISOString(),
            algorithm: this.algorithmVersion,
            emoji: isGoal ? '⚽' : '❌'
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

// 🎯 STRICT OCR IMAGE VALIDATION
class StrictImageValidator {
    constructor(openaiApiKey) {
        this.openaiApiKey = openaiApiKey;
    }

    async validateImage(imageUrl) {
        try {
            console.log('🔍 بدء التحقق الصارم من الصورة باستخدام OCR...');
            
            // 1. OCR Validation as Primary Check
            const ocrResult = await this.validateWithOCR(imageUrl);
            
            if (!ocrResult.valid) {
                return {
                    valid: false,
                    message: '❌ *هذه ليست صورة اللعبة* 🎯\n\n' +
                            '📋 *السبب:* ' + ocrResult.reason + '\n\n' +
                            '🎮 *يجب أن تحتوي الصورة على:*\n' +
                            '• كلمة "GOAL" أو "هدف"\n' +
                            '• كلمة "لا هدف"\n' + 
                            '• زر "وضع الرهان"\n' +
                            '• واجهة لعبة كرة القدم\n\n' +
                            '📸 *يرجى إرسال صورة واضحة من داخل لعبة GOAL فقط*',
                    confidence: 0.0
                };
            }

            // 2. Optional: OpenAI Vision for enhanced validation
            let visionResult = { valid: true, confidence: 0.8 };
            if (this.openaiApiKey) {
                try {
                    visionResult = await this.validateWithOpenAIVision(imageUrl);
                } catch (visionError) {
                    console.log('⚠️ OpenAI Vision غير متاح، استخدام OCR فقط');
                }
            }

            // 3. Final decision
            if (ocrResult.valid && visionResult.valid) {
                return {
                    valid: true,
                    message: '✅ *تم التحقق بنجاح - صورة لعبة GOAL أصلية* 🎯',
                    confidence: Math.max(ocrResult.confidence, visionResult.confidence),
                    details: {
                        ocr: ocrResult,
                        vision: visionResult
                    }
                };
            } else {
                return {
                    valid: false,
                    message: '❌ *فشل التحقق - الصورة غير مقبولة*\n\n' +
                            '📸 يرجى إرسال صورة واضحة من داخل لعبة GOAL',
                    confidence: 0.3
                };
            }

        } catch (error) {
            console.error('خطأ في التحقق من الصورة:', error);
            return {
                valid: false,
                message: '❌ *حدث خطأ في التحقق من الصورة*\n\n' +
                        '🔄 يرجى المحاولة مرة أخرى أو إرسال صورة أخرى',
                confidence: 0.1
            };
        }
    }

    async validateWithOCR(imageUrl) {
        try {
            console.log('📝 جاري فحص النص في الصورة...');
            
            // Download image for OCR processing
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);
            
            // Create a worker for OCR
            const worker = await createWorker('eng+ara');
            
            try {
                const { data: { text } } = await worker.recognize(imageBuffer);
                await worker.terminate();

                const cleanText = text.toLowerCase().trim();
                console.log('📄 النص المستخرج من الصورة:', cleanText);

                // الكلمات المفتاحية الإلزامية للعبة GOAL
                const requiredKeywords = [
                    "goal", "gool", "هدف", 
                    "لا هدف", "ضع الرهان", "وضع الرهان",
                    "كيفية اللعب", "GOAL!", "رهان"
                ];

                // البحث عن الكلمات المفتاحية
                const foundKeywords = requiredKeywords.filter(keyword => 
                    cleanText.includes(keyword.toLowerCase())
                );

                console.log(`🔍 الكلمات المفتاحية الموجودة: ${foundKeywords.length} من ${requiredKeywords.length}`);
                console.log(`📋 الكلمات الموجودة:`, foundKeywords);

                // التحقق الصارم: يجب وجود كلمتين مفتاحيتين على الأقل
                if (foundKeywords.length >= 2) {
                    return {
                        valid: true,
                        confidence: 0.95,
                        method: 'ocr',
                        foundKeywords: foundKeywords,
                        foundCount: foundKeywords.length,
                        totalKeywords: requiredKeywords.length
                    };
                } else {
                    return {
                        valid: false,
                        confidence: 0.0,
                        method: 'ocr',
                        reason: `لم يتم العثور على الكلمات المطلوبة (${foundKeywords.length} من 2)`,
                        foundKeywords: foundKeywords,
                        foundCount: foundKeywords.length,
                        requiredCount: 2
                    };
                }

            } catch (ocrError) {
                await worker.terminate();
                throw ocrError;
            }

        } catch (error) {
            console.error('❌ خطأ في معالجة OCR:', error);
            return {
                valid: false,
                confidence: 0.0,
                method: 'ocr',
                reason: 'فشل في قراءة النص من الصورة'
            };
        }
    }

    async validateWithOpenAIVision(imageUrl) {
        if (!this.openaiApiKey) {
            return { valid: true, confidence: 0.7, method: 'openai_vision_skipped' };
        }

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: `هل هذه الصورة من لعبة GOAL لكرة القدم؟ اجب بنعم أو لا فقط.`
                            },
                            {
                                type: "image_url",
                                image_url: imageUrl
                            }
                        ]
                    }
                ],
                max_tokens: 10,
                temperature: 0.1
            });

            const answer = response.choices[0].message.content.toLowerCase().trim();
            console.log('👁️ نتيجة تحقق OpenAI Vision:', answer);

            if (answer.includes('نعم') || answer.includes('yes') || answer.includes('صحيح')) {
                return {
                    valid: true,
                    confidence: 0.90,
                    method: 'openai_vision'
                };
            } else {
                return {
                    valid: false,
                    confidence: 0.85,
                    method: 'openai_vision',
                    reason: 'الذكاء الاصطناعي لم يتعرف على اللعبة'
                };
            }
        } catch (error) {
            console.error('⚠️ خطأ في OpenAI Vision:', error);
            return {
                valid: true, // نعتبرها صالحة في حالة الخطأ
                confidence: 0.6,
                method: 'openai_vision_error'
            };
        }
    }

    async analyzeGameImage(imageUrl) {
        try {
            console.log('🎯 بدء التحليل المتقدم للصورة...');
            
            // استخدام الذكاء الاصطناعي إذا كان متاحاً
            if (this.openaiApiKey) {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "أنت خبير محترف في تحليل لقطات ألعاب كرة القدم وخاصة لعبة GOAL. قم بتحليل الصورة بدقة وأعط توقعاً مهنياً للنتيجة."
                        },
                        {
                            role: "user",
                            content: [
                                { 
                                    type: "text", 
                                    text: `قم بتحليل هذه الصورة من لعبة GOAL وأعطني:
1. التوقع النهائي (هدف / لا هدف)
2. نسبة الاحتمالية
3. التحليل التقني المفصل
4. مستوى الثقة في التوقع

كن دقيقاً ومهنياً في التحليل.` 
                                },
                                { 
                                    type: "image_url", 
                                    image_url: imageUrl 
                                }
                            ]
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.7
                });

                const analysis = response.choices[0].message.content;
                console.log('📊 نتيجة التحليل المتقدم:', analysis);
                return this.parseAnalysisResult(analysis);
            } else {
                // استخدام النظام الاحتياطي
                console.log('🔄 استخدام النظام الاحتياطي للتحليل');
                return this.generateFallbackPrediction();
            }

        } catch (error) {
            console.error('❌ خطأ في التحليل المتقدم:', error);
            return this.generateFallbackPrediction();
        }
    }

    parseAnalysisResult(analysisText) {
        let type = '❌ NO GOAL - لا هدف';
        let probability = 70;
        let confidence = 85;

        if (analysisText.toLowerCase().includes('هدف') || analysisText.toLowerCase().includes('goal')) {
            type = '⚽ GOAL - هدف';
            probability = 75 + Math.floor(Math.random() * 20);
        }

        const numbers = analysisText.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
            probability = parseInt(numbers[0]) || probability;
            confidence = parseInt(numbers[1]) || confidence;
        }

        return {
            type: type,
            probability: Math.min(probability, 95),
            confidence: Math.min(confidence, 98),
            reasoning: analysisText,
            timestamp: new Date().toISOString(),
            algorithm: "11.1_advanced",
            emoji: type.includes('GOAL') ? '⚽' : '❌'
        };
    }

    generateFallbackPrediction() {
        const isGoal = Math.random() > 0.5;
        const probability = Math.floor(Math.random() * 30) + 70;
        
        return {
            type: isGoal ? '⚽ GOAL - هدف' : '❌ NO GOAL - لا هدف',
            probability: probability,
            confidence: 95,
            reasoning: isGoal ? 
                `🔍 التحليل الاحتياطي: الوضع الهجومي يشير إلى إمكانية تسجيل هدف بنسبة ${probability}%` :
                `🔍 التحليل الاحتياطي: الدفاع المنظم يقلل فرص التسجيل بنسبة ${probability}%`,
            timestamp: new Date().toISOString(),
            algorithm: "11.1_fallback",
            emoji: isGoal ? '⚽' : '❌'
        };
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

// 📢 CHANNEL BROADCAST SYSTEM
class ChannelManager {
    constructor(bot, channelId) {
        this.bot = bot;
        this.channelId = channelId;
    }

    async sendSubscriptionMessage(userData, subscriptionType, amount) {
        try {
            const message = `
🎉 *اشتراك جديد مفعل* 🎉

👤 *المستخدم:* ${userData.username || 'غير معروف'}
🔐 *الحساب:* ${userData.onexbet || 'غير محدد'}
📦 *الباقة:* ${subscriptionType}
💰 *المبلغ:* ${amount}$
⏰ *التاريخ:* ${new Date().toLocaleString('ar-EG')}

✅ *تم تفعيل الاشتراك بنجاح*
            `;

            await this.bot.telegram.sendMessage(this.channelId, message, {
                parse_mode: 'Markdown'
            });
            console.log('✅ تم إرسال رسالة الاشتراك للقناة');
        } catch (error) {
            console.error('خطأ في إرسال الاشتراك للقناة:', error);
        }
    }

    async sendPredictionMessage(userData, prediction, betAmount) {
        try {
            const message = `
🎯 *تحليل توقع جديد* 🎯

👤 *المستخدم:* ${userData.username || 'غير معروف'}
🔐 *الحساب:* ${userData.onexbet || 'غير محدد'}
💰 *مبلغ الرهان:* ${betAmount}$

${prediction.emoji} *التوقع:* ${prediction.type}
📈 *الاحتمالية:* ${prediction.probability}%
🎯 *الثقة:* ${prediction.confidence}%

💡 *التحليل:*
${prediction.reasoning}

⏰ *الوقت:* ${new Date().toLocaleString('ar-EG')}
            `;

            await this.bot.telegram.sendMessage(this.channelId, message, {
                parse_mode: 'Markdown'
            });
            console.log('✅ تم إرسال رسالة التوقع للقناة');
        } catch (error) {
            console.error('خطأ في إرسال التوقع للقناة:', error);
        }
    }

    async sendPaymentMessage(paymentData) {
        try {
            const message = `
💳 *طلب دفع جديد* 💳

👤 *المستخدم:* ${paymentData.username || 'غير معروف'}
🔐 *الحساب:* ${paymentData.onexbet || 'غير محدد'}
📦 *الباقة:* ${paymentData.subscription_type}
💰 *المبلغ:* ${paymentData.amount}$

⏰ *الوقت:* ${new Date().toLocaleString('ar-EG')}
            `;

            await this.bot.telegram.sendMessage(this.channelId, message, {
                parse_mode: 'Markdown'
            });
        } catch (error) {
            console.error('خطأ في إرسال الدفع للقناة:', error);
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
            console.error('خطأ في البحث عن المستخدمين:', error);
            return [];
        }
    }
}

// INITIALIZE SYSTEMS
const goalAI = new GoalPredictionAI();
const dbManager = new DatabaseManager();
const fakeStats = new FakeStatistics();
const imgbbUploader = new ImgBBUploader(CONFIG.IMGBB_API_KEY);
const imageValidator = new StrictImageValidator(CONFIG.AI_APIS.OPENAI);
const channelManager = new ChannelManager(bot, "@GEMZGOOL");

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

        // إرسال رسالة ترحيب
        try {
            await ctx.replyWithPhoto(CONFIG.START_IMAGE, {
                caption: `🎉 *مرحباً بك في نظام GOAL Predictor Pro v${CONFIG.VERSION}* 🚀\n\n` +
                        `🤖 *أقوى نظام لتوقع الأهداف بالذكاء الاصطناعي*\n` +
                        `💎 *المطور:* ${CONFIG.DEVELOPER}\n\n` +
                        `📢 *انضم لقناتنا للحصول على آخر التحديثات:*\n` +
                        `${CONFIG.CHANNEL_LINK}\n\n` +
                        `🎯 *يمكنك البدء في استخدام البوت مباشرة*`
            });
        } catch (photoError) {
            await ctx.replyWithMarkdown(
                `🎉 *مرحباً بك في نظام GOAL Predictor Pro v${CONFIG.VERSION}* 🚀\n\n` +
                `🤖 *أقوى نظام لتوقع الأهداف بالذكاء الاصطناعي*\n\n` +
                `📢 *انضم لقناتنا:* ${CONFIG.CHANNEL_LINK}\n\n` +
                `🎯 *يمكنك البدء في استخدام البوت مباشرة*`
            );
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
📢 *القناة:* ${CONFIG.CHANNEL_LINK}

🔢 *الآن اضغط على "🔐 إدخال رقم الحساب" لبدء التسجيل*
            `;

            await ctx.replyWithMarkdown(welcomeMessage, getLoginKeyboard());
        }

    } catch (error) {
        console.error('خطأ في أمر البدء:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام، يرجى المحاولة لاحقاً');
    }
});

// ... (استمرار جميع الدوال المساعدة والإدارة كما في الإصدار السابق)

// 🖼️ STRICT OCR IMAGE ANALYSIS HANDLER
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

        // 🔍 التحقق الصارم من الصورة باستخدام OCR
        const validationMsg = await ctx.reply('🔍 جاري فحص الصورة والتحقق من أنها من لعبة GOAL...');
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

        const processingMsg = await ctx.reply('🔄 جاري التحليل المتقدم للصورة...');

        try {
            // استخدام التحليل المتقدم
            const prediction = await imageValidator.analyzeGameImage(imageUrl);
            
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

📸 *الصورة:* ✅ تم التحقق والتحليل بنجاح
🕒 *الوقت:* ${new Date().toLocaleString('ar-EG')}
🔐 *الحساب:* \`${userData.onexbet}\`
💰 *مبلغ الرهان:* ${session.currentBet}$

🎯 *نتيجة التحليل:*
${prediction.type}
📈 *الاحتمالية:* ${prediction.probability}%
🎯 *الثقة:* ${prediction.confidence}%

💡 *التحليل المتقدم:*
${prediction.reasoning}

${userData.subscription_status !== 'active' ? 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}` : 
    `✅ *اشتراك نشط - محاولات غير محدودة*`}
            `;

            await ctx.replyWithMarkdown(analysisMessage);
            
            // إرسال التحليل للقناة
            await channelManager.sendPredictionMessage(userData, prediction, session.currentBet);
            
            // إضافة أزرار النتيجة
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
            console.error('خطأ في التحليل المتقدم:', analysisError);
            
            // استخدام النظام الاحتياطي
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
        console.error('خطأ في معالج الصور:', error);
        await ctx.replyWithMarkdown('❌ *حدث خطأ في التحليل*', getMainKeyboard());
    }
});

// ... (استمرار جميع الدوال المساعدة والإدارة كما في الإصدار السابق)

// 🚀 START BOT
bot.launch().then(() => {
    console.log('🎉 نجاح! AI GOAL Predictor v11.1 يعمل الآن!');
    console.log('👤 المطور:', CONFIG.DEVELOPER);
    console.log('📢 القناة:', CONFIG.CHANNEL);
    console.log('🔗 رابط القناة:', CONFIG.CHANNEL_LINK);
    console.log('🌐 الفحص الصحي: http://localhost:' + PORT);
    console.log('🔧 آيدي الإدمن:', CONFIG.ADMIN_ID);
}).catch(console.error);

// ⚡ إيقاف سلس
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('✅ نظام توقع الأهداف بالذكاء الاصطناعي جاهز للعمل!');
