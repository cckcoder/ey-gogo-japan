# EY Gogo Japan

แอปดูแผนเที่ยวญี่ปุ่น 24/11 – 2/12/2026 แบบ PWA ที่เปิดได้แม้ไม่มีอินเทอร์เน็ต

## รันที่เครื่อง

ต้องใช้ Node.js 22 ขึ้นไป

```bash
npm install
npm run dev
```

เปิด http://localhost:5173 แล้วกด DevTools → Toggle device toolbar (ตั้งความกว้าง 360px) เพื่อดูแบบมือถือ

ตอนรัน `npm run dev` ระบบออฟไลน์ (service worker) ยังไม่ทำงาน ถ้าจะทดสอบออฟไลน์ ให้ดูหัวข้อถัดไป

## ทดสอบแบบ production และออฟไลน์

```bash
npm run build
npm run preview
```

1. เปิด http://localhost:4173 ตอนมีเน็ต แล้วรอให้หน้าโหลดเสร็จหนึ่งครั้ง
2. DevTools → Network → เลือก **Offline**
3. Reload หน้าจะต้องยังแสดงครบทั้ง 9 วัน

ถ้าอยากเปิดจากมือถือในวง Wi-Fi เดียวกัน ให้ใช้ `npm run preview -- --host` แล้วเปิด IP ที่แสดงใน terminal (ระบบออฟไลน์บนมือถือจะทำงานเมื่อเปิดผ่าน HTTPS หรือ localhost เท่านั้น)

## Tests

```bash
npm test
```

## อัปเดตแผนเที่ยว

ข้อมูลอยู่ที่ `src/data/snapshot.json` ซึ่งดึงมาจาก Trello ห้ามแก้ไฟล์นี้ด้วยมือ

1. แก้แผนใน Trello แล้วติด label **Gogo** ให้การ์ดที่ต้องการแสดงในแอป (การ์ดที่มีเลขจองหรือยอดเงินไม่ต้องติด label)
2. บอก Claude Code ว่า "refresh snapshot" (Claude Code จะแปลการ์ดที่เปลี่ยนเป็นภาษาอังกฤษให้ด้วย)
3. Commit แล้ว push เพื่อให้ Cloudflare Pages deploy
4. เปิดแอปบนมือถือตอนมีเน็ตหนึ่งครั้ง แล้วเช็กว่า "ข้อมูล ณ" เป็นวันที่ล่าสุด

## เอกสาร

- `docs/PLAN.md`: ขั้นตอนการสร้างแอปและการ deploy
- `docs/DESIGN.md`: แนวทางดีไซน์
- `CONTEXT.md`: คำศัพท์ที่ใช้ในโปรเจกต์
