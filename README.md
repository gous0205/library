# BookNest – Premium Online Library Management System

React + Vite + Tailwind CSS + Framer Motion + React Router + React Hook Form + Recharts + qrcode + html5-qrcode.
Data is stored in browser localStorage (`library_users`, `library_books`, `library_transactions`, `library_notifications`, `library_settings`).

## Run
```bash
npm install
npm run dev
npm run build      # production build in /dist
```
Node.js 18+ required. Camera scanning needs HTTPS (or localhost) and browser camera permission.

## Demo logins
- Admin: `admin@college.edu` / `admin123`
- Student: roll `21CS001` + college email `asha@college.edu`

## QR workflow
1. Admin: QR Code Management → Registration QR. Set the **deployed URL** there (QR codes must not point to localhost).
2. Student scans it, registers, downloads the ID card (contains a QR with only a link + member ID).
3. Admin: Issue Books → scan student → scan book → **Confirm**. Return Books works the same way.
4. Camera unavailable? Every scan step has manual ID entry.

## Deploy (static hosting)
`npm run build`, then upload `dist/` to Netlify, Vercel or GitHub Pages. The app uses hash routing, so no server rewrite rules are needed.

## Security note
localStorage is NOT secure authentication. Anyone with access to the browser can read or edit the data, and data is not shared between devices.
For production use a backend, hashed passwords/real authentication and a database. All data access goes through `src/services/library.js`, so that file is the only one to replace.

## Structure
`src/components/{common,qr,students,transactions,layout}`, `src/pages/{admin,student,auth,registration}`, `src/context`, `src/hooks`, `src/services`, `src/utils`.
"# library" 
