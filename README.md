# Artmiu — Moonlab. Live Tracker

ปฏิทินติดตามการไลฟ์ขายเครื่องประดับ 31 วัน สำหรับแบรนด์ **Moonlab.** (@moonlab.jewelry)
ใช้ร่วมกัน 2 เครื่อง — ข้อมูลซิงก์ผ่านฐานข้อมูลกลาง

## รันในเครื่อง

```
npm install
npm start
```

เปิด http://localhost:3000 (ข้อมูลเก็บเป็นไฟล์ใน `data/`)

## Deploy บน Render

1. สร้าง Postgres ฟรีที่ https://neon.tech (Sign in ด้วย GitHub) → copy connection string
2. Render → **New + → Web Service** → เลือก repo นี้
   - Build: `npm install` / Start: `node server.js`
   - Environment Variable: `DATABASE_URL` = connection string จาก Neon
3. เปิด `https://<ชื่อ-service>.onrender.com` → เด้งเข้า `/moonlab` อัตโนมัติ

หมายเหตุ: ถ้าไม่ตั้ง `DATABASE_URL` แอปยังรันได้ แต่ข้อมูลบน Render จะหายเมื่อเซิร์ฟเวอร์ restart
(ดิสก์ของ free tier ไม่ถาวร) — ต้องตั้ง `DATABASE_URL` เสมอสำหรับใช้งานจริง
