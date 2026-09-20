# EduTest — Vercel deploy tayyor loyihasi 🚀

EduTest — Node.js + Vercel Serverless Functions (API papka) arxitekturasidagi online test platformasi.

## 📁 Loyiha tuzilishi

```
chsb dovland/
├── index.html           ← Frontend (test + admin panel, Ctrl+M orqali kirasiz)
├── package.json
├── vercel.json
│
├── api/                 ← Backend (Vercel Serverless Functions)
│   ├── _store.js        ← Saqlash qatlami (Vercel KV / in-memory)
│   ├── questions.js     ← GET/POST/DELETE savollar bazasi
│   └── results.js       ← GET/POST test natijalari
│
└── seed/
    └── questions.json   ← Dastlabki 70 ta savol (birinchi ishga tushishda)
```

## ⚡ API endpointlar

| Endpoint | Metod | Vazifasi |
|----------|-------|----------|
| `/api/questions` | GET | Barcha savollarni qaytaradi |
| `/api/questions` | POST | Savol qo'shadi / yangilaydi |
| `/api/questions?id=...` | DELETE | Savolni o'chiradi |
| `/api/results` | GET | Natijalar ro'yxati |
| `/api/results` | POST | Yangi natijani saqlaydi |

## 🚀 Vercelga deploy qilish (eng oson yo'l)

### 1-usul: GitHub orqali (node o'rnatish shart emas)

1. Ushbu papka uchun GitHub repozitoriy yarating va fayllarni yuklab qo'ying:
   ```
   git init
   git add .
   git commit -m "EduTest backend bilan"
   git remote add origin https://github.com/USERNAME/edutest.git
   git push -u origin main
   ```
2. [vercel.com](https://vercel.com) → **Add New Project** → **Import** GitHub repozitoriyasini.
3. Vercel hammasini o'zi aniqlaydi (api papka + boost: boshqa sozlash shart emas) → **Deploy**.
4. Tayyor! Sayt `https://ingiz.vercel.app` manzilida ochiladi.

### 2-usul: Vercel CLI orqali (Node.js kerak)

```
npm i -g vercel
cd "chsb dovland"
vercel
vercel --prod
```

## 🗄 Doimiy bazani ulash (ixtiyoriy, tavsiya etiladi)

Standart holatda savollar server xotirasida turadi — funksiya sovuq holatga qaytsa (cold start)
standart 70 savolga qaytadi. Doimiy saqlash uchun:

1. Vercel dashboard → **Storage** → **Create KV Store** → yarating.
2. Loyihangizga **Connect** qiling (env o'zgaruvchilar avtomatik qo'shiladi).
3. **Redeploy** qiling.

Shundan so'ng admin panel qo'shgan savollar va natijalar **doimiy** saqlanadi.

## 🔐 Admin panel

- Kirish: **Ctrl + M** → parol: `123456`
- Parolni `index.html` dagi `ADMIN_PASSWORD` da o'zgartirasiz.

## 🧪 Lokal sinov

API ishlamasa, sayt avtomatik ravishda standart 70 savolga o'tadi (oflayn rejim).
To'liq test qilish uchun Vercelga deploy qilganingizdan so'ng tekshiring.