# Arsitektur CMS IMBS

## Ringkasan
CMS sekolah (profil + SIAKAD dasar + SPMB) berbasis Next.js App Router.
Mengacu penuh ke `blueprint/` — tidak menambah fitur di luar blueprint tanpa persetujuan.

## Struktur Folder
```
e:/CMS IMBS/
  blueprint/            # acuan (jangan diubah)
  tasks/                # T-001..T-013 + _SCHEMA + TODO_INDEX
  prompts/              # prompt siap-pakai per agent
  docs/                 # ARCHITECTURE, DATA_MODEL, UI_GUIDE
  prisma/schema.prisma  # model DB resmi
  src/
    app/
      (public)/         # halaman publik (SEO-friendly, ISR)
        page.tsx        # homepage: sambutan, berita, agenda, prestasi, galeri
        profil/, guru/, program/, prestasi/, berita/, agenda/, galeri/, download/, spmb/, faq/, pengaduan/
      admin/            # area admin (guard SUPERADMIN/OPERATOR/GURU)
        page.tsx        # dashboard + statistik + SystemLog terbaru
        posts/, pages/, sambutan/, galeri/, gtk/, siswa/, jurusan/, prestasi/, menu/, tema/, spmb/, download/, inbox/, users/, logs/
      api/.../route.ts  # REST JSON + Zod
    components/ui/      # Button, Table, Card, Badge, Editor (TipTap), MenuBuilder (dnd)
    lib/                # db.ts, auth.ts, theme.ts, validators.ts, excel.ts
  public/uploads/       # upload dev
```

## Keputusan Arsitektur
1. **Rendering:** publik = Server Components + ISR (`revalidate`), admin = Client Components + fetch API.
2. **Auth:** NextAuth Credentials (email+password, bcrypt). Session JWT berisi `role`. Middleware guard `/admin/*`.
3. **RBAC matrix:**
   - SUPERADMIN: semua.
   - OPERATOR_BERITA: posts, pages, galeri, komentar.
   - OPERATOR_SPMB: spmb, download, messages.
   - GURU: materi/nilai (fase later), profil sendiri.
   - Publik read-only.
4. **Tema:** CSS variables `--brand-*` + `data-theme` + `.dark`. 10 preset di `src/lib/theme.ts`. Golden Ratio 1.618 untuk spacing/font/radius.
5. **Menu:** tabel `MenuItem` (self-relation, `order`, `parentId`, `visible`, max depth 3). UI drag-drop (dnd-kit) di admin, render rekursif di publik.
6. **Upload:** API `/api/upload` → `public/uploads/<tahun>/<bulan>/<uuid>.<ext>` (validasi mime+size). Siap ganti ke S3 tanpa ubah UI.
7. **Log:** setiap login + mutasi penting tulis `SystemLog { userId, ip, mac, action, detail }`.
8. **Import Excel:** `xlsx` parse di server, preview + validasi Zod sebelum insert Siswa massal.

## Alur Data Kunci
- Post: admin tulis (DRAFT) → schedule `publishedAt` → cron/ISR publish → publik baca + komentar (moderasi) → SystemLog.
- SPMB: publik isi form → `SPMBApplicant(PENDING)` + upload berkas → operator validasi (VERIFIED/REJECTED) → statistik dashboard.
- Siswa: import Excel/CRUD → grouping Rombel (Kelas) → kenaikan/kelulusan batch → arsip.

## Env
```
DATABASE_URL="file:./dev.db"   # dev SQLite; prod: postgresql://...
NEXTAUTH_SECRET="ganti-ini"
NEXTAUTH_URL="http://localhost:3000"
```
