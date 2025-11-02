#!/usr/bin/env python3
import os
import io
import logging
import sqlite3
from datetime import datetime

import requests
from PIL import Image
import cv2
import numpy as np
import pytesseract
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters

import openai

# -------------------------
# Config / env
TELEGRAM_TOKEN = os.getenv("8125363786:AAFZaOGSAvq_p8Sc8cq2bIKZlpe4ej7tmdU")
OPENAI_API_KEY = os.getenv("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")
if not TELEGRAM_TOKEN or not OPENAI_API_KEY:
    raise RuntimeError("Set TELEGRAM_TOKEN and OPENAI_API_KEY env variables")

openai.api_key = OPENAI_API_KEY

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database (simple SQLite to store images and predictions)
DB_PATH = "predictions.db"

def init_db():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS shots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        file_id TEXT,
        saved_path TEXT,
        extracted_text TEXT,
        features TEXT,
        prediction TEXT,
        confidence REAL,
        created_at TEXT
    )
    """)
    con.commit()
    con.close()

init_db()

# -------------------------
# Utilities: image download & basic CV features
def download_telegram_file(context: ContextTypes.DEFAULT_TYPE, file_id: str, target_path: str):
    bot = context.bot
    file = bot.get_file(file_id)
    file.download(custom_path=target_path)
    return target_path

def load_image_cv(path: str):
    pil = Image.open(path).convert("RGB")
    arr = np.array(pil)
    img = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
    return img

def detect_pitch_and_green_ratio(img):
    """Simple heuristic: compute fraction of green pixels (pitch presence)."""
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # green mask range (tunable)
    lower = np.array([35, 40, 40])
    upper = np.array([90, 255, 255])
    mask = cv2.inRange(hsv, lower, upper)
    green_ratio = mask.sum() / (mask.size)  # 0..1
    return float(green_ratio)

def try_ocr_scoreboard(img):
    """Try to OCR likely scoreboard regions: we'll scan top-right and top-left boxes."""
    h, w = img.shape[:2]
    boxes = []
    # plausible scoreboard areas (tunable)
    boxes.append(img[0:int(h*0.18), int(w*0.55):w])  # top-right strip
    boxes.append(img[0:int(h*0.18), 0:int(w*0.45)])  # top-left strip
    text_agg = []
    for i, region in enumerate(boxes):
        gray = cv2.cvtColor(region, cv2.COLOR_BGR2GRAY)
        # increase contrast
        gray = cv2.equalizeHist(gray)
        # pytesseract expects PIL
        pil = Image.fromarray(gray)
        text = pytesseract.image_to_string(pil, config='--psm 6 digits')
        text = text.strip()
        if text:
            text_agg.append(text)
    return " | ".join(text_agg)

def compute_basic_features(path: str):
    img = load_image_cv(path)
    green_ratio = detect_pitch_and_green_ratio(img)
    ocr_txt = try_ocr_scoreboard(img)
    # Basic brightness
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    brightness = float(np.mean(gray)) / 255.0
    # rough player count via contour detection (very rough)
    blurred = cv2.GaussianBlur(gray, (5,5), 0)
    _, th = cv2.threshold(blurred, int(brightness*120), 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)
    contours, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    approx_player_count = min(len(contours), 200)
    features = {
        "green_ratio": round(green_ratio, 4),
        "brightness": round(brightness, 4),
        "approx_contours": int(approx_player_count),
        "ocr_text": ocr_txt
    }
    return features

# -------------------------
# OpenAI prompt builder & call
def build_prompt_from_features(features: dict, user_note: str = ""):
    prompt = f"""
You are an assistant that analyzes a single image (a screenshot from a live football/goal betting view) and provides:
1) concise description of what's visible (pitch presence ratio, brightness, OCR scoreboard text if any, number of blobs detected),
2) a reasoned probabilistic prediction whether the next short event (next minute) will be: "goal" or "no goal",
3) a confidence score (0.0-1.0),
4) a short algorithmic suggestion (what signals to track, how to update model over time).
Provide output in JSON like:
{{"description":"...", "prediction":"goal"|"no goal", "confidence":0.72, "explanation":"...", "algorithm":"..."}}.

Use only the features provided below and don't hallucinate unseen numbers.
Features: {features}
User note: "{user_note}"
Be conservative and explicit about uncertainty.
"""
    return prompt

def ask_openai_for_prediction(prompt: str, model: str = "gpt-4o-mini"):
    # We'll call OpenAI Chat/Responses for text completion.
    # Using the older completions/chat API pattern to maximize compatibility:
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-4o-mini" if "gpt-4o-mini" in openai.Model.list() else "gpt-4o",
            messages=[{"role":"user", "content": prompt}],
            max_tokens=400,
            temperature=0.2
        )
        text = resp.choices[0].message['content'].strip()
        return text
    except Exception as e:
        # fallback to responses API if above fails
        try:
            r = openai.Completion.create(
                engine="text-davinci-003",
                prompt=prompt,
                max_tokens=400,
                temperature=0.2
            )
            return r.choices[0].text.strip()
        except Exception as ex:
            logger.exception("OpenAI request failed")
            return f"ERROR: OpenAI request failed: {ex}"

# -------------------------
# Telegram handlers
async def start_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "أهلاً! ارسل صورة شاشة (screenshot) من لعبة Gool (1xBet) وسأحاول أحللها وأعطيك توقعًا احتماليًا. بعد رفع الصورة اضغط زر 'تحليل & توقع'."
    )

async def help_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("أرسل صورة، أو استخدم /start. ملاحظة: هذه توقعات احتمالية للمساعدة فقط.")

async def image_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Called when user sends an image. Save it and present a button to analyze."""
    user = update.message.from_user
    photos = update.message.photo
    if not photos:
        await update.message.reply_text("لم أجد صورة. الرجاء إرسال صورة واضحة.")
        return
    # take highest resolution
    photo = photos[-1]
    file_id = photo.file_id
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    saved_path = f"images/{user.id}_{timestamp}.jpg"
    os.makedirs("images", exist_ok=True)
    # download
    download_telegram_file(context, file_id, saved_path)
    # store metadata in DB (initial)
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("INSERT INTO shots (user_id, file_id, saved_path, created_at) VALUES (?, ?, ?, ?)",
                (user.id, file_id, saved_path, datetime.utcnow().isoformat()))
    shot_id = cur.lastrowid
    con.commit()
    con.close()

    keyboard = InlineKeyboardMarkup.from_button(
        InlineKeyboardButton("🔎 تحليل & توقع", callback_data=f"analyze:{shot_id}")
    )
    await update.message.reply_text("تم استلام الصورة. اضغط الزر لتحليلها:", reply_markup=keyboard)

async def analyze_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """When user presses analyze button."""
    query = update.callback_query
    await query.answer()
    data = query.data
    if not data.startswith("analyze:"):
        await query.edit_message_text("خطأ: بيانات غير مفهومة.")
        return
    shot_id = int(data.split(":")[1])
    # fetch shot row
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT id, user_id, file_id, saved_path FROM shots WHERE id = ?", (shot_id,))
    row = cur.fetchone()
    con.close()
    if not row:
        await query.edit_message_text("عذراً، لم أجد الصورة في السجل.")
        return
    _, user_id, file_id, saved_path = row
    # compute features
    features = compute_basic_features(saved_path)
    prompt = build_prompt_from_features(features)
    # call OpenAI
    await query.edit_message_text("جاري إرسال البيانات إلى نموذج OpenAI... انتظر ثواني.")
    try:
        ai_response = ask_openai_for_prediction(prompt)
    except Exception as e:
        ai_response = f"ERROR: {e}"
    # try to parse simple confidence from response if present (very rough)
    confidence = None
    import re
    m = re.search(r'"confidence"\s*:\s*([0-9]*\.?[0-9]+)', ai_response)
    if m:
        try:
            confidence = float(m.group(1))
        except:
            confidence = None
    # Save results
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("""UPDATE shots SET extracted_text = ?, features = ?, prediction = ?, confidence = ? WHERE id = ?""",
                (features.get("ocr_text",""), str(features), ai_response, confidence, shot_id))
    con.commit()
    con.close()

    # reply with result and action buttons
    text_msg = f"✅ تحليل مكتمل:\n\n**الخصائص المستخرجة:**\nGreen ratio: {features['green_ratio']}\nBrightness: {features['brightness']}\nContours: {features['approx_contours']}\nOCR: {features['ocr_text']}\n\n**رد الذكاء الاصطناعي:**\n{ai_response}\n\n**ملاحظة:** هذه توقعات احتمالية فقط."
    keyboard = InlineKeyboardMarkup.from_row([
        InlineKeyboardButton("حفظ هذه الحالة", callback_data=f"save:{shot_id}"),
        InlineKeyboardButton("حذف الصورة", callback_data=f"delete:{shot_id}")
    ])
    # edit message or send new
    try:
        await query.edit_message_text(text_msg, reply_markup=keyboard, parse_mode="Markdown")
    except Exception:
        await context.bot.send_message(chat_id=user_id, text=text_msg, reply_markup=keyboard, parse_mode="Markdown")

async def save_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    data = query.data
    if data.startswith("save:"):
        shot_id = int(data.split(":")[1])
        # mark saved by just responding (we keep DB)
        await query.edit_message_text("تم حفظ الحالة في السجل ✅")
    elif data.startswith("delete:"):
        shot_id = int(data.split(":")[1])
        con = sqlite3.connect(DB_PATH)
        cur = con.cursor()
        cur.execute("SELECT saved_path FROM shots WHERE id = ?", (shot_id,))
        r = cur.fetchone()
        if r:
            path = r[0]
            try:
                os.remove(path)
            except:
                pass
        cur.execute("DELETE FROM shots WHERE id = ?", (shot_id,))
        con.commit()
        con.close()
        await query.edit_message_text("تم حذف الحالة والصورة 🗑️")

# Admin command to list last N predictions (simple)
async def history_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute("SELECT id, created_at, prediction, confidence FROM shots ORDER BY id DESC LIMIT 10")
    rows = cur.fetchall()
    con.close()
    if not rows:
        await update.message.reply_text("لا سجلات بعد.")
        return
    msgs = []
    for r in rows:
        msgs.append(f"#{r[0]} • {r[1]} • conf: {r[3]}\n{(r[2][:180]+'...') if r[2] and len(r[2])>180 else r[2]}")
    await update.message.reply_text("\n\n".join(msgs))

# -------------------------
# Main: build app
def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start_handler))
    app.add_handler(CommandHandler("help", help_handler))
    app.add_handler(CommandHandler("history", history_handler))
    app.add_handler(MessageHandler(filters.PHOTO, image_handler))
    app.add_handler(CallbackQueryHandler(analyze_callback, pattern=r"^analyze:\d+$"))
    app.add_handler(CallbackQueryHandler(save_callback, pattern=r"^(save|delete):\d+$"))

    logger.info("Bot started (polling).")
    app.run_polling()

if __name__ == "__main__":
    main()
