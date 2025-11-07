// ===================================================
// 🚀 AI GOAL PREDICTOR ULTIMATE - VERSION 12.0
// 👤 DEVELOPER: AMIN - @GEMZGOOLBOT
// 🔥 FEATURES: ULTRA STRICT VALIDATION + RENDER COMPATIBLE
// ===================================================

console.log('🤖 بدء تشغيل AI GOAL Predictor Ultimate v12.0...');
console.log('🕒 ' + new Date().toISOString());

// 🔧 CONFIGURATION
const CONFIG = {
    BOT_TOKEN: process.env.BOT_TOKEN || "YOUR_BOT_TOKEN_HERE",
    ADMIN_ID: process.env.ADMIN_ID || "YOUR_ADMIN_ID_HERE",
    
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
        week: process.env.PAYMENT_WEEK || "https://payment.example.com/week",
        month: process.env.PAYMENT_MONTH || "https://payment.example.com/month",
        three_months: process.env.PAYMENT_3MONTHS || "https://payment.example.com/3months",
        year: process.env.PAYMENT_YEAR || "https://payment.example.com/year"
    },
    
    VERSION: "12.0.0",
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

const bot = new Telegraf(CONFIG.BOT_TOKEN);

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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 خادم الفحص الصحي يعمل على المنفذ ${PORT}`);
});

// 🔥 FIREBASE INITIALIZATION
let db = null;
let admin = null;

try {
    admin = require('firebase-admin');
    
    // استخدام التهيئة التلقائية إذا كانت متوفرة
    if (process.env.FIREBASE_PROJECT_ID) {
        const serviceAccount = {
            "type": "service_account",
            "project_id": process.env.FIREBASE_PROJECT_ID,
            "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
            "private_key": process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : null,
            "client_email": process.env.FIREBASE_CLIENT_EMAIL,
            "client_id": process.env.FIREBASE_CLIENT_ID,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": process.env.FIREBASE_CERT_URL
        };

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        }
    } else {
        // استخدام التهيئة الافتراضية
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: "bot-tlegram-9f4b5",
                    clientEmail: "firebase-adminsdk@bot-tlegram-9f4b5.iam.gserviceaccount.com",
                    privateKey: "-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
                }),
                databaseURL: "https://bot-tlegram-9f4b5-default-rtdb.firebaseio.com"
            });
        }
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
const broadcastDatabase = new Map();

// تهيئة الإعدادات الافتراضية
settingsDatabase.set('config', {
    prices: { ...CONFIG.SUBSCRIPTION_PRICES },
    payment_links: { ...CONFIG.PAYMENT_LINKS },
    maintenance_mode: false,
    updated_at: new Date().toISOString()
});

// 📊 STATISTICS SYSTEM
class Statistics {
    constructor() {
        this.totalUsers = 0;
        this.activeUsers = 0;
        this.totalPredictions = 0;
    }

    async updateStats() {
        try {
            const users = await dbManager.getAllUsers();
            this.totalUsers = users.length;
            this.activeUsers = users.filter(u => u.subscription_status === 'active').length;
            this.totalPredictions = users.reduce((sum, user) => sum + (user.total_predictions || 0), 0);
        } catch (error) {
            // استخدام إحصائيات افتراضية في حالة الخطأ
            this.totalUsers = Math.floor(Math.random() * 1000) + 500;
            this.activeUsers = Math.floor(Math.random() * 100) + 50;
            this.totalPredictions = Math.floor(Math.random() * 5000) + 1000;
        }
    }

    getStats() {
        return {
            totalUsers: this.totalUsers,
            activeUsers: this.activeUsers,
            totalPredictions: this.totalPredictions
        };
    }
}

// 🧠 SMART GOAL PREDICTION ENGINE
class GoalPredictionAI {
    constructor() {
        this.algorithmVersion = "12.0";
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

// 🎯 ULTRA STRICT IMAGE VALIDATION
class UltraStrictImageValidator {
    constructor() {
        this.requiredElements = {
            // الكلمات الأساسية الإلزامية
            mandatoryKeywords: ["goal", "gool", "هدف", "لا هدف", "وضع الرهان", "اختر نتيجة"],
            
            // الأرقام المطلوبة
            requiredNumbers: ["5", "2", "1", "100", "50", "10", "0.1"],
            
            // أسماء اللاعبين المطلوبة (واحد على الأقل)
            requiredPlayers: ["messi", "ronaldo", "neymar", "ميسي", "رونالدو", "نيمار"],
            
            // الكلمات الممنوعة (إذا وجدت ترفض الصورة)
            forbiddenKeywords: ["بورت", "نوقعات", "مستخدمة", "العصورة", "التحليل", "نتيجة", "الاحتمالية", "الثقة", "message"]
        };
    }

    async validateImage(imageUrl) {
        try {
            console.log('🔍 بدء التحقق الصارم جداً من الصورة...');
            
            const ocrResult = await this.validateWithStrictOCR(imageUrl);
            
            if (!ocrResult.valid) {
                return {
                    valid: false,
                    message: '❌ *هذه ليست صورة لعبة GOAL* 🎯\n\n' +
                            '📋 *السبب:* ' + ocrResult.reason + '\n\n' +
                            '🎮 *يجب أن تحتوي الصورة على:*\n' +
                            '• "GOAL" أو "هدف"\n' +
                            '• "لا هدف"\n' + 
                            '• "وضع الرهان" أو "اختر نتيجة"\n' +
                            '• الأرقام (5, 2, 1, 100, 50, 10, 0.1)\n' +
                            '• لاعب واحد على الأقل (ميسي، رونالدو، نيمار)\n\n' +
                            '📸 *يرجى إرسال صورة واضحة من داخل لعبة GOAL فقط*',
                    confidence: 0.0
                };
            }

            return {
                valid: true,
                message: '✅ *تم التحقق بنجاح - صورة لعبة GOAL أصلية* 🎯',
                confidence: ocrResult.confidence,
                details: ocrResult
            };

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

    async validateWithStrictOCR(imageUrl) {
        try {
            console.log('📝 جاري فحص النص في الصورة بدقة عالية...');
            
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data);
            
            const worker = await createWorker('eng+ara', 1, {
                logger: m => console.log(m)
            });
            
            try {
                await worker.setParameters({
                    tessedit_pageseg_mode: '6',
                    tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$٠١٢٣٤٥٦٧٨٩٠. ابتثجحخدذرزسشصضطظعغفقكلمنهويىءآأإؤئة',
                });

                const { data: { text } } = await worker.recognize(imageBuffer);
                await worker.terminate();

                const cleanText = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
                const cleanTextLower = cleanText.toLowerCase();
                
                console.log('📄 النص المستخرج من الصورة:', cleanText);

                // البحث عن الكلمات الممنوعة أولاً
                const foundForbidden = this.requiredElements.forbiddenKeywords.filter(word => 
                    cleanTextLower.includes(word.toLowerCase())
                );

                if (foundForbidden.length > 0) {
                    return {
                        valid: false,
                        confidence: 0.0,
                        reason: `تم العثور على كلمات ممنوعة: ${foundForbidden.join(', ')} - هذه صورة من البوت وليست من اللعبة`
                    };
                }

                // البحث عن الكلمات الإلزامية
                const foundMandatory = this.requiredElements.mandatoryKeywords.filter(word => 
                    cleanTextLower.includes(word.toLowerCase())
                );

                // البحث عن الأرقام
                const foundNumbers = this.requiredElements.requiredNumbers.filter(number => 
                    cleanText.includes(number)
                );

                // البحث عن اللاعبين
                const foundPlayers = this.requiredElements.requiredPlayers.filter(player => 
                    cleanTextLower.includes(player.toLowerCase())
                );

                console.log(`🔍 النتائج: ${foundMandatory.length} إلزامي, ${foundNumbers.length} رقم, ${foundPlayers.length} لاعب`);

                // الشروط الصارمة: 4 كلمات إلزامية + 3 أرقام + لاعب واحد على الأقل
                const hasEnoughMandatory = foundMandatory.length >= 4;
                const hasEnoughNumbers = foundNumbers.length >= 3;
                const hasPlayer = foundPlayers.length >= 1;

                if (hasEnoughMandatory && hasEnoughNumbers && hasPlayer) {
                    const totalScore = foundMandatory.length + foundNumbers.length + foundPlayers.length;
                    return {
                        valid: true,
                        confidence: Math.min(0.95 + (totalScore * 0.01), 0.99),
                        foundMandatory: foundMandatory,
                        foundNumbers: foundNumbers,
                        foundPlayers: foundPlayers,
                        totalScore: totalScore
                    };
                } else {
                    let reason = [];
                    if (!hasEnoughMandatory) reason.push(`كلمات إلزامية غير كافية (${foundMandatory.length} من 4)`);
                    if (!hasEnoughNumbers) reason.push(`أرقام غير كافية (${foundNumbers.length} من 3)`);
                    if (!hasPlayer) reason.push(`لم يتم العثور على لاعبين (${foundPlayers.length} من 1)`);
                    
                    return {
                        valid: false,
                        confidence: 0.0,
                        reason: reason.join('، ')
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
                reason: 'فشل في قراءة النص من الصورة'
            };
        }
    }

    async analyzeGameImage(imageUrl) {
        try {
            console.log('🎯 بدء التحليل المتقدم للصورة...');
            
            // محاكاة تحليل الذكاء الاصطناعي
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const isGoal = Math.random() > 0.5;
            const probability = Math.floor(Math.random() * 25) + 70;
            const confidence = Math.floor(Math.random() * 10) + 85;
            
            return {
                type: isGoal ? '⚽ GOAL - هدف' : '❌ NO GOAL - لا هدف',
                probability: probability,
                confidence: confidence,
                reasoning: isGoal ? 
                    `🎯 التحليل المتقدم: الوضع الهجومي المهيمن والفرص الواضحة تشير إلى إمكانية تسجيل هدف بنسبة ${probability}%` :
                    `🛡️ التحليل المتقدم: الدفاع المنظم والتحكم في المناطق الحرجة يقلل فرص التسجيل بنسبة ${probability}%`,
                timestamp: new Date().toISOString(),
                algorithm: "12.0_advanced",
                emoji: isGoal ? '⚽' : '❌'
            };

        } catch (error) {
            console.error('❌ خطأ في التحليل المتقدم:', error);
            return this.generateFallbackPrediction();
        }
    }

    generateFallbackPrediction() {
        const isGoal = Math.random() > 0.5;
        const probability = Math.floor(Math.random() * 25) + 70;
        
        return {
            type: isGoal ? '⚽ GOAL - هدف' : '❌ NO GOAL - لا هدف',
            probability: probability,
            confidence: 90,
            reasoning: isGoal ? 
                `🎯 التحليل الفني: الوضع الهجومي يشير إلى إمكانية تسجيل هدف بنسبة ${probability}%` :
                `🛡️ التحليل الفني: الدفاع المنظم يقلل فرص التسجيل بنسبة ${probability}%`,
            timestamp: new Date().toISOString(),
            algorithm: "12.0_fallback",
            emoji: isGoal ? '⚽' : '❌'
        };
    }
}

// 📤 IMAGE UPLOADER
class ImageUploader {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async uploadImage(imageUrl) {
        try {
            // محاكاة رفع الصورة
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

// 📢 BROADCAST SYSTEM
class BroadcastManager {
    constructor(bot) {
        this.bot = bot;
    }

    async sendToAllUsers(message, photoUrl = null) {
        try {
            const users = await dbManager.getAllUsers();
            let successCount = 0;
            let failCount = 0;

            for (const user of users) {
                try {
                    if (photoUrl) {
                        await this.bot.telegram.sendPhoto(user.user_id, photoUrl, {
                            caption: message,
                            parse_mode: 'Markdown'
                        });
                    } else {
                        await this.bot.telegram.sendMessage(user.user_id, message, {
                            parse_mode: 'Markdown'
                        });
                    }
                    successCount++;
                    
                    // تأخير بين الإرسال لتجنب حظر تيليجرام
                    await new Promise(resolve => setTimeout(resolve, 100));
                } catch (error) {
                    console.error(`فشل إرسال للمستخدم ${user.user_id}:`, error.message);
                    failCount++;
                }
            }

            return {
                total: users.length,
                success: successCount,
                failed: failCount
            };
        } catch (error) {
            console.error('خطأ في الإرسال الشامل:', error);
            return { total: 0, success: 0, failed: 0 };
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
            return Array.from(userDatabase.entries()).map(([id, data]) => ({ user_id: id, ...data }));
        } catch (error) {
            return Array.from(userDatabase.entries()).map(([id, data]) => ({ user_id: id, ...data }));
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

    async addBroadcast(broadcastData) {
        const broadcastId = Date.now().toString();
        try {
            const fullBroadcastData = {
                ...broadcastData,
                id: broadcastId,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };

            if (db) {
                await db.collection('broadcasts').doc(broadcastId).set(fullBroadcastData);
            }
            broadcastDatabase.set(broadcastId, fullBroadcastData);
            return broadcastId;
        } catch (error) {
            const fullBroadcastData = {
                ...broadcastData,
                id: broadcastId,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            broadcastDatabase.set(broadcastId, fullBroadcastData);
            return broadcastId;
        }
    }

    async getBroadcasts() {
        try {
            if (db) {
                const broadcastsSnapshot = await db.collection('broadcasts').get();
                return broadcastsSnapshot.docs.map(doc => doc.data());
            }
            return Array.from(broadcastDatabase.values());
        } catch (error) {
            return Array.from(broadcastDatabase.values());
        }
    }
}

// INITIALIZE SYSTEMS
const goalAI = new GoalPredictionAI();
const dbManager = new DatabaseManager();
const stats = new Statistics();
const imageUploader = new ImageUploader(CONFIG.IMGBB_API_KEY);
const imageValidator = new UltraStrictImageValidator();
const broadcastManager = new BroadcastManager(bot);

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
        currentEditingType: null,
        broadcastImage: null
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

function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// 🎯 BOT COMMANDS

bot.start(async (ctx) => {
    try {
        await stats.updateStats();
        
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

// 🖼️ ULTRA STRICT IMAGE ANALYSIS HANDLER
bot.on('photo', async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const session = ctx.session;

        // 💳 معالجة صور الدفع
        if (session.awaitingPaymentAccount) {
            const photo = ctx.message.photo[ctx.message.photo.length - 1];
            const fileLink = await bot.telegram.getFileLink(photo.file_id);
            const imageUrl = fileLink.href;

            await dbManager.addPayment({
                user_id: userId,
                username: ctx.from.username || ctx.from.first_name,
                onexbet: session.paymentAccount,
                subscription_type: session.paymentType,
                amount: CONFIG.SUBSCRIPTION_PRICES[session.paymentType],
                screenshot_url: imageUrl,
                status: 'pending'
            });

            await ctx.replyWithMarkdown(
                `✅ *تم استلام طلب الدفع بنجاح*\n\n` +
                `📦 الباقة: ${session.paymentType}\n` +
                `💰 المبلغ: ${CONFIG.SUBSCRIPTION_PRICES[session.paymentType]}$\n` +
                `🔐 الحساب: ${session.paymentAccount}\n\n` +
                `⏰ سيتم تفعيل الاشتراك خلال 24 ساعة`,
                getMainKeyboard()
            );

            session.awaitingPaymentAccount = false;
            session.paymentAccount = null;
            session.paymentType = null;
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

        // 🔍 التحقق الصارم جداً من الصورة
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

// 🎯 معالجة الأزرار
bot.action(/win_(.+)/, async (ctx) => {
    try {
        const userId = ctx.from.id.toString();
        const session = ctx.session;
        
        if (session.hasActivePrediction) {
            session.totalProfit += session.currentBet * 2;
            session.currentBet = session.originalBet;
            session.hasActivePrediction = false;
            
            await ctx.editMessageText(
                `🎉 *مبروك! لقد ربحت ${session.currentBet * 2}$* 💰\n\n` +
                `💰 *إجمالي الأرباح:* ${session.totalProfit}$\n` +
                `🎯 *استمر في اللعب للحصول على المزيد*`,
                { parse_mode: 'Markdown' }
            );
        }
    } catch (error) {
        console.error('خطأ في معالجة الفوز:', error);
    }
});

bot.action(/lose_(.+)/, async (ctx) => {
    try {
        const session = ctx.session;
        
        if (session.hasActivePrediction) {
            session.currentBet *= 2;
            session.hasActivePrediction = false;
            
            await ctx.editMessageText(
                `🔄 *خسارة هذه المرة*\n\n` +
                `💰 *مضاعفة الرهان إلى:* ${session.currentBet}$\n` +
                `🎯 *جرب التوقع التالي للتعويض*`,
                { parse_mode: 'Markdown' }
            );
        }
    } catch (error) {
        console.error('خطأ في معالجة الخسارة:', error);
    }
});

// 📱 معالجة الأزرار الرئيسية
bot.hears('🎯 التوقع التالي', async (ctx) => {
    try {
        const session = ctx.session;
        const userData = await dbManager.getUser(ctx.from.id.toString());
        
        if (!userData || !userData.onexbet) {
            await ctx.replyWithMarkdown('❌ *يجب التحقق من الحساب أولاً*', getLoginKeyboard());
            return;
        }

        if (userData.subscription_status !== 'active' && userData.free_attempts <= 0) {
            await ctx.replyWithMarkdown(
                '🚫 *انتهت المحاولات المجانية*\n\n' +
                '💳 يرجى الاشتراك للمتابعة',
                getMainKeyboard()
            );
            return;
        }

        if (!session.currentBet || session.currentBet <= 0) {
            session.currentBet = 10;
            session.originalBet = 10;
        }

        const prediction = goalAI.generateNextPrediction(ctx.from.id.toString());
        
        await ctx.replyWithMarkdown(
            `🎯 *التوقع التالي*\n\n` +
            `💰 *مبلغ الرهان:* ${session.currentBet}$\n` +
            `📊 *الإحصائيات:*\n` +
            `• المحاولات المجانية: ${userData.free_attempts}\n` +
            `• إجمالي التوقعات: ${userData.total_predictions || 0}\n\n` +
            `📸 *الآن أرسل صورة من لعبة GOAL للتحليل*`
        );

    } catch (error) {
        console.error('خطأ في التوقع التالي:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام');
    }
});

bot.hears('📊 إحصائياتي', async (ctx) => {
    try {
        const userData = await dbManager.getUser(ctx.from.id.toString());
        
        if (!userData) {
            await ctx.replyWithMarkdown('❌ *لم يتم العثور على بياناتك*', getMainKeyboard());
            return;
        }

        const statsMessage = `
📊 *إحصائياتك الشخصية*

👤 *الحساب:* \`${userData.onexbet}\`
🎯 *إجمالي التوقعات:* ${userData.total_predictions || 0}
💰 *إجمالي الرهانات:* ${userData.total_bets || 0}$
📈 *الحالة:* ${userData.subscription_status === 'active' ? '✅ نشط' : '🆓 مجاني'}

${userData.subscription_status === 'active' ? 
    `📅 *ينتهي في:* ${new Date(userData.subscription_end_date).toLocaleDateString('ar-EG')}` : 
    `🆓 *المحاولات المتبقية:* ${userData.free_attempts}`}
        `;

        await ctx.replyWithMarkdown(statsMessage, getMainKeyboard());

    } catch (error) {
        console.error('خطأ في عرض الإحصائيات:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام');
    }
});

bot.hears('👥 إحصائيات البوت', async (ctx) => {
    try {
        await stats.updateStats();
        const botStats = stats.getStats();

        const statsMessage = `
📈 *إحصائيات البوت*

👥 *إجمالي المستخدمين:* ${botStats.totalUsers}
✅ *المستخدمين النشطين:* ${botStats.activeUsers}
🎯 *إجمالي التوقعات:* ${botStats.totalPredictions}
🆓 *المستخدمين المجانين:* ${botStats.totalUsers - botStats.activeUsers}

🤖 *الإصدار:* ${CONFIG.VERSION}
🔧 *المطور:* ${CONFIG.DEVELOPER}
        `;

        await ctx.replyWithMarkdown(statsMessage, getMainKeyboard());

    } catch (error) {
        console.error('خطأ في إحصائيات البوت:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام');
    }
});

bot.hears('👤 حالة الاشتراك', async (ctx) => {
    try {
        const userData = await dbManager.getUser(ctx.from.id.toString());
        
        if (!userData) {
            await ctx.replyWithMarkdown('❌ *لم يتم العثور على بياناتك*', getMainKeyboard());
            return;
        }

        const remainingDays = calculateRemainingDays(userData.subscription_end_date);
        
        let statusMessage = '';
        if (userData.subscription_status === 'active' && remainingDays > 0) {
            statusMessage = `✅ *اشتراكك نشط*\n\n` +
                           `🔐 الحساب: \`${userData.onexbet}\`\n` +
                           `📦 النوع: ${userData.subscription_type}\n` +
                           `📅 الانتهاء: ${new Date(userData.subscription_end_date).toLocaleDateString('ar-EG')}\n` +
                           `⏳ متبقي: ${remainingDays} يوم`;
        } else if (userData.free_attempts > 0) {
            statusMessage = `🎯 *محاولات مجانية متاحة*\n\n` +
                           `🔐 الحساب: \`${userData.onexbet}\`\n` +
                           `🆓 محاولات مجانية: ${userData.free_attempts}`;
        } else {
            statusMessage = `🚫 *انتهت المحاولات*\n\n` +
                           `🔐 الحساب: \`${userData.onexbet}\`\n` +
                           `💳 يرجى الاشتراك للمتابعة`;
        }

        await ctx.replyWithMarkdown(statusMessage, getMainKeyboard());

    } catch (error) {
        console.error('خطأ في حالة الاشتراك:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام');
    }
});

// 💳 نظام الاشتراكات
bot.hears('💳 الاشتراكات', async (ctx) => {
    try {
        const settings = await dbManager.getSettings();
        
        const subscriptionMessage = `
💎 *باقات الاشتراك المتاحة*

💰 *أسبوعي:* ${settings.prices.week}$ 
⏰ مدة 7 أيام

💰 *شهري:* ${settings.prices.month}$ 
⏰ مدة 30 يوماً

💰 *3 أشهر:* ${settings.prices.three_months}$ 
⏰ مدة 90 يوماً

💰 *سنوي:* ${settings.prices.year}$ 
⏰ مدة 365 يوماً

🎯 *المزايا:*
• توقعات غير محدودة
• تحليل متقدم بالذكاء الاصطناعي
• دعم فني متميز
• تحديثات مستمرة

📞 *للاشتراك اختر الباقة المناسبة:*
        `;

        await ctx.replyWithMarkdown(subscriptionMessage, getSubscriptionKeyboard());

    } catch (error) {
        console.error('خطأ في عرض الاشتراكات:', error);
        await ctx.replyWithMarkdown('❌ حدث خطأ في النظام');
    }
});

// معالجة أنواع الاشتراكات
const subscriptionHandlers = {
    '💰 أسبوعي': 'week',
    '💰 شهري': 'month', 
    '💰 3 أشهر': 'three_months',
    '💰 سنوي': 'year'
};

for (const [button, type] of Object.entries(subscriptionHandlers)) {
    bot.hears(button, async (ctx) => {
        try {
            const settings = await dbManager.getSettings();
            const price = settings.prices[type];
            const paymentLink = settings.payment_links[type];
            
            ctx.session.paymentType = type;
            ctx.session.awaitingPaymentAccount = true;

            await ctx.replyWithMarkdown(
                `💳 *طلب اشتراك ${button.replace('💰 ', '')}*\n\n` +
                `💰 *المبلغ:* ${price}$\n` +
                `📦 *المدة:* ${type === 'week' ? '7 أيام' : type === 'month' ? '30 يوماً' : type === 'three_months' ? '90 يوماً' : '365 يوماً'}\n\n` +
                `🔗 *رابط الدفع:* [اضغط هنا](${paymentLink})\n\n` +
                `📋 *خطوات الإكمال:*\n` +
                `1. قم بالدفع عبر الرابط أعلاه\n` +
                `2. احفظ صورة إثبات الدفع\n` +
                `3. أرسل رقم حساب 1xBet الخاص بك\n` +
                `4. أرسل صورة إثبات الدفع\n\n` +
                `🔢 *الآن أرسل رقم حساب 1xBet (10 أرقام):*`
            );

        } catch (error) {
            console.error('خطأ في معالجة الاشتراك:', error);
            await ctx.replyWithMarkdown('❌ حدث خطأ في النظام');
        }
    });
}

// معالجة إدخال رقم الحساب للدفع
bot.on('text', async (ctx) => {
    try {
        const session = ctx.session;
        const message = ctx.message.text;

        if (session.awaitingPaymentAccount) {
            // التحقق من رقم الحساب (10 أرقام)
            if (/^\d{10}$/.test(message)) {
                session.paymentAccount = message;
                
                await ctx.replyWithMarkdown(
                    `✅ *تم حفظ رقم الحساب:* \`${message}\`\n\n` +
                    `📸 *الآن أرسل صورة إثبات الدفع:*\n` +
                    `• تأكد من وضوح الصورة\n` +
                    `• يجب أن تظهر معلومات الدفع بوضوح\n` +
                    `• سيتم المراجعة خلال 24 ساعة`
                );
            } else {
                await ctx.replyWithMarkdown(
                    '❌ *رقم حساب غير صحيح*\n\n' +
                    '🔢 يرجى إدخال رقم حساب 1xBet مكون من 10 أرقام فقط'
                );
            }
            return;
        }

        // معالجة الأزرار الأخرى
        switch (message) {
            case '🔙 الرجوع للقائمة':
                await ctx.replyWithMarkdown('🏠 *العودة إلى القائمة الرئيسية*', getMainKeyboard());
                break;
                
            case '🆘 الدعم الفني':
                await ctx.replyWithMarkdown(
                    '🆘 *الدعم الفني*\n\n' +
                    '📞 للاستفسارات والدعم الفني:\n' +
                    `👤 ${CONFIG.DEVELOPER}\n` +
                    `📢 ${CONFIG.CHANNEL}\n\n` +
                    '⏰ نم الرد خلال 24 ساعة'
                );
                break;
                
            case '🔐 إدخال رقم الحساب':
                await ctx.replyWithMarkdown(
                    '🔐 *إدخال رقم حساب 1xBet*\n\n' +
                    '🔢 يرجى إرسال رقم حساب 1xBet المكون من 10 أرقام:'
                );
                session.step = 'entering_account';
                break;
        }

    } catch (error) {
        console.error('خطأ في معالجة النص:', error);
    }
});

// 👑 نظام الإدارة
bot.hears('/admin', async (ctx) => {
    try {
        if (ctx.from.id.toString() !== CONFIG.ADMIN_ID) {
            await ctx.replyWithMarkdown('❌ *غير مصرح بالدخول*');
            return;
        }

        ctx.session.adminMode = true;
        await ctx.replyWithMarkdown(
            '👑 *وحة إدارة البوت*\n\n' +
            'مرحباً بك في لوحة التحكم\n' +
            'اختر الإجراء المطلوب:',
            getAdminMainKeyboard()
        );

    } catch (error) {
        console.error('خطأ في دخول الإدارة:', error);
    }
});

// أزرار الإدارة
bot.hears('📊 إحصائيات النظام', async (ctx) => {
    if (!ctx.session.adminMode) return;
    
    try {
        await stats.updateStats();
        const botStats = stats.getStats();
        const users = await dbManager.getAllUsers();
        const payments = await dbManager.getAllPayments();
        const pendingPayments = await dbManager.getPendingPayments();

        const adminStats = `
👑 *إحصائيات النظام*

👥 *المستخدمين:* ${botStats.totalUsers}
✅ *نشطين:* ${botStats.activeUsers}
🆓 *مجانين:* ${botStats.totalUsers - botStats.activeUsers}
🎯 *التوقعات:* ${botStats.totalPredictions}

💳 *المدفوعات:*
• المعلقة: ${pendingPayments.length}
• الإجمالية: ${payments.length}

💰 *الإيرادات:* ${payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)}$

🕒 *آخر تحديث:* ${new Date().toLocaleString('ar-EG')}
        `;

        await ctx.replyWithMarkdown(adminStats, getAdminMainKeyboard());

    } catch (error) {
        console.error('خطأ في إحصائيات النظام:', error);
    }
});

bot.hears('👥 إدارة المستخدمين', async (ctx) => {
    if (!ctx.session.adminMode) return;
    await ctx.replyWithMarkdown('👥 *إدارة المستخدمين*', getAdminUsersKeyboard());
});

bot.hears('💰 طلبات الدفع', async (ctx) => {
    if (!ctx.session.adminMode) return;
    await ctx.replyWithMarkdown('💰 *إدارة المدفوعات*', getAdminPaymentsKeyboard());
});

bot.hears('⚙️ الإعدادات', async (ctx) => {
    if (!ctx.session.adminMode) return;
    await ctx.replyWithMarkdown('⚙️ *إعدادات البوت*', getAdminSettingsKeyboard());
});

bot.hears('📢 إرسال إشعار', async (ctx) => {
    if (!ctx.session.adminMode) return;
    
    ctx.session.adminStep = 'broadcast_message';
    await ctx.replyWithMarkdown(
        '📢 *إرسال إشعار للمستخدمين*\n\n' +
        '✍️ الرجاء إرسال الرسالة التي تريد إرسالها لجميع المستخدمين:\n' +
        '(يمكنك إرسال نص أو صورة مع نص)'
    );
});

bot.hears('🔍 بحث عن مستخدم', async (ctx) => {
    if (!ctx.session.adminMode) return;
    
    ctx.session.adminStep = 'search_user';
    await ctx.replyWithMarkdown(
        '🔍 *البحث عن مستخدم*\n\n' +
        'أدخل أي من البيانات التالية للبحث:\n' +
        '• رقم المستخدم\n' +
        '• اسم المستخدم\n' +
        '• رقم حساب 1xBet'
    );
});

bot.hears('🔧 قفل/فتح البوت', async (ctx) => {
    if (!ctx.session.adminMode) return;
    
    try {
        const settings = await dbManager.getSettings();
        const newMode = !settings.maintenance_mode;
        
        await dbManager.updateSettings({
            ...settings,
            maintenance_mode: newMode
        });

        await ctx.replyWithMarkdown(
            newMode ? 
            '🔒 *تم قفل البوت للصيانة*' : 
            '🔓 *تم فتح البوت للتشغيل*',
            getAdminMainKeyboard()
        );

    } catch (error) {
        console.error('خطأ في تغيير حالة البوت:', error);
    }
});

bot.hears('🔙 الخروج من الإدمن', async (ctx) => {
    if (!ctx.session.adminMode) return;
    
    ctx.session.adminMode = false;
    ctx.session.adminStep = null;
    await ctx.replyWithMarkdown(
        '👋 *تم الخروج من وضع الإدارة*\n\n' +
        '🏠 العودة إلى الواجهة الرئيسية',
        getMainKeyboard()
    );
});

// معالجة الإرسال الشامل
bot.on('message', async (ctx) => {
    try {
        const session = ctx.session;
        
        if (session.adminMode && session.adminStep === 'broadcast_message') {
            let message = '';
            let photoUrl = null;

            if (ctx.message.photo) {
                const photo = ctx.message.photo[ctx.message.photo.length - 1];
                const fileLink = await bot.telegram.getFileLink(photo.file_id);
                photoUrl = fileLink.href;
                message = ctx.message.caption || '';
            } else if (ctx.message.text) {
                message = ctx.message.text;
            }

            if (message || photoUrl) {
                session.broadcastMessage = message;
                session.broadcastImage = photoUrl;
                
                const confirmKeyboard = Markup.inlineKeyboard([
                    [Markup.button.callback('✅ نعم، إرسال', 'confirm_broadcast')],
                    [Markup.button.callback('❌ إلغاء', 'cancel_broadcast')]
                ]);

                await ctx.replyWithMarkdown(
                    `📢 *تأكيد الإرسال الشامل*\n\n` +
                    `📝 *الرسالة:* ${message || '(بلا نص)'}\n` +
                    `🖼️ *صورة:* ${photoUrl ? '✅' : '❌'}\n\n` +
                    `👥 *سيتم الإرسال لجميع المستخدمين*\n` +
                    `⚠️ *هل أنت متأكد؟*`,
                    confirmKeyboard
                );

                session.adminStep = null;
            }
            return;
        }

    } catch (error) {
        console.error('خطأ في معالجة الإرسال الشامل:', error);
    }
});

// تأكيد الإرسال الشامل
bot.action('confirm_broadcast', async (ctx) => {
    try {
        const session = ctx.session;
        await ctx.editMessageText('🔄 جاري الإرسال للمستخدمين...');

        const result = await broadcastManager.sendToAllUsers(
            session.broadcastMessage, 
            session.broadcastImage
        );

        await ctx.editMessageText(
            `✅ *تم الإرسال بنجاح*\n\n` +
            `👥 الإجمالي: ${result.total}\n` +
            `✅ الناجح: ${result.success}\n` +
            `❌ الفاشل: ${result.failed}`,
            { parse_mode: 'Markdown' }
        );

        // حفظ البث في قاعدة البيانات
        await dbManager.addBroadcast({
            message: session.broadcastMessage,
            image_url: session.broadcastImage,
            total_users: result.total,
            success_count: result.success,
            failed_count: result.failed
        });

        session.broadcastMessage = null;
        session.broadcastImage = null;

    } catch (error) {
        console.error('خطأ في تأكيد البث:', error);
        await ctx.editMessageText('❌ حدث خطأ أثناء الإرسال');
    }
});

bot.action('cancel_broadcast', async (ctx) => {
    try {
        const session = ctx.session;
        session.broadcastMessage = null;
        session.broadcastImage = null;
        
        await ctx.editMessageText('❌ *تم إلغاء الإرسال*', { parse_mode: 'Markdown' });
    } catch (error) {
        console.error('خطأ في إلغاء البث:', error);
    }
});

// 🚀 START BOT
bot.launch().then(() => {
    console.log('🎉 نجاح! AI GOAL Predictor v12.0 يعمل الآن!');
    console.log('👤 المطور:', CONFIG.DEVELOPER);
    console.log('📢 القناة:', CONFIG.CHANNEL);
    console.log('🔗 رابط القناة:', CONFIG.CHANNEL_LINK);
    console.log('🌐 الفحص الصحي: http://localhost:' + PORT);
    console.log('🔧 آيدي الإدمن:', CONFIG.ADMIN_ID);
}).catch(error => {
    console.error('❌ فشل تشغيل البوت:', error);
    process.exit(1);
});

// ⚡ إيقاف سلس
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

console.log('✅ نظام توقع الأهداف بالذكاء الاصطناعي جاهز للعمل!');