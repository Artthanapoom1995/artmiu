# Artmiu — Moonlab. Live Tracker

ปฏิทินติดตามการไลฟ์ขายเครื่องประดับ 31 วัน สำหรับแบรนด์ **Moonlab.** (@moonlab.jewelry)
ใช้ร่วมกัน 2 เครื่อง — ข้อมูลซิงก์ผ่านที่เก็บข้อมูลกลาง

## Deploy บน Netlify (แนะนำ)

1. https://app.netlify.com → **Add new site → Import an existing project** → GitHub → เลือก repo นี้
2. ค่า build ทั้งหมดอ่านจาก `netlify.toml` อัตโนมัติ → กด **Deploy**
3. เปลี่ยนชื่อ site เป็น `artmiu` (Site configuration → Change site name) → ได้ https://artmiu.netlify.app

- หน้าเว็บ: `public/moonlab.html` (static)
- API: `netlify/functions/moonlab.mjs` → `GET/PUT /api/moonlab`
- ที่เก็บข้อมูล: **Netlify Blobs** (มากับ Netlify ฟรี ไม่ต้องมี DB ภายนอก)
- ไม่มีปัญหาเซิร์ฟเวอร์หลับ — static + serverless ตอบทันทีตลอด

## รันในเครื่อง (ทางเลือก)

```
npm install
npm start
```

เปิด http://localhost:3000 — ใช้ `server.js` (Express) ข้อมูลเก็บเป็นไฟล์ใน `data/`
หรือถ้าอยาก deploy แบบเซิร์ฟเวอร์เต็มตัว (เช่น Render) ก็ใช้ `server.js` ได้เช่นกัน
โดยตั้ง `DATABASE_URL` เป็น Postgres (เช่น Neon)
