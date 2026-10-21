# UI Guide — Golden Ratio + ReactBits

Sumber: `blueprint/blueprint fitur front end.md#5`. WAJIB diikuti semua halaman.

## 0. Komponen UI
- Tailwind tetap menjadi fondasi utility CSS; shadcn/ui adalah kumpulan komponen yang disimpan di repo, bukan pengganti Tailwind.
- Komponen baru memakai Shadcn dari `src/components/ui/*` dan token semantik (`bg-background`, `text-foreground`, `border-border`). Gabungkan class kondisional dengan `cn()` dari `src/lib/utils.ts`.
- Untuk repo Next.js 14 + Tailwind v3 ini, tambahkan komponen lewat `npx shadcn@2.3.0 add <nama>` agar tetap cocok dengan versi CSS saat ini.
- Echo UI berada di `src/components/echo/*`; tema dimuat satu kali dari `src/app/layout.tsx`. Gunakan Echo untuk aksi utama atau kontrol yang mendapat manfaat dari respons tactile, bukan untuk menghias semua tombol.
- Pertahankan warna identitas dan pilihan tema melalui token brand. Jangan menambahkan komponen UI baru sebagai markup Tailwind khusus jika komponen Shadcn atau Echo yang sesuai sudah ada.
- Seluruh form dan tabel admin/publik memakai komponen `Button`, `Card`, `Input`, `Textarea`, `NativeSelect`, dan `Table` dari `src/components/ui/*`; link yang tampil sebagai tombol memakai `Button asChild`.
- Komponen lama yang masih berupa elemen halaman mempertahankan tag semantik melalui `Card as="form|section|article"`; tema memakai Echo `HardwareButton`.
- `npm run build` hanya menjalankan Next.js build agar tidak menimpa Prisma native engine yang sedang dipakai proses dev di Windows. Setelah mengubah `prisma/schema.prisma`, jalankan `npm run prisma:generate`, lalu validasi dengan `npm run prisma:validate`.

## Navigasi Responsif
- `NavigationMenu` Shadcn dipakai mulai breakpoint `xl`; item tambahan dikumpulkan di menu `Lainnya` agar baris atas tetap muat.
- Di bawah `xl`, gunakan `Sheet` Shadcn dengan judul yang bisa dibaca screen reader dan tautan berukuran nyaman disentuh.
- Verifikasi layout pada lebar 320, 390, 768, 1024, 1280, dan 1440px; tidak boleh ada scroll horizontal atau item yang terpotong.

## 1. Golden Ratio (φ = 1.618)
- **Skala font:** 12 → 14 → 16 → 20 → 25 → 31 → 39 (tiap naik ≈ ×1.25–1.3, heading besar ≈ ×1.618 dari body).
  - body 16, h4 20, h3 25, h2 31, h1 39.
- **Spacing:** 4, 8, 13, 21, 34 (deret mirip Fibonacci/φ).
- **Button:** `padding: 13px 21px; radius: 13px; font 16 semibold`. Varian: primary (brand gradient), secondary (outline), ghost.
- **Table:** header 13 uppercase tracking-wide, row 16, padding sel 13px 21px, zebra + hover, sticky header untuk tabel panjang (siswa, log).
- **Warna utama:** 1 brand + 1 aksen komplementer + netral. Gradasi brand→aksen dengan rasio 60-30-10 (60 netral, 30 brand soft, 10 aksen).
- **Radius & shadow:** card radius 21px, shadow lembut; jangan gunakan shadow keras.

## 2. Tema (10 warna + Dark Mode)
Preset di `src/lib/theme.ts` (contoh): emerald, blue, indigo, violet, rose, orange, teal, cyan, lime, slate.
- Implementasi: `html[data-theme="emerald"] { --brand-500: ... }` + `.dark` override.
- Toggle dark mode persist di `localStorage` + `SiteSetting.theme`.
- Admin bisa ganti tema tanpa coding (T-010).

## 3. ReactBits sebagai Referensi
- URL: https://reactbits.dev/components
- Yang dipakai: AnimatedList (berita), SpotlightCard (prestasi), ShinyText/GradientText (hero), Dock/Drawers (navigasi mobile), ClickSpark/Magnet (button), Masonry (galeri).
- Jangan copy-paste mentah yang berat; adaptasi ke Tailwind + Server Components. Animasi harus `prefers-reduced-motion` friendly.
- Setiap halaman publik minimal 1 sentuhan ReactBits-style (tercatat di T-012).

## 4. Layout Standar
- Publik: Topbar kontak → Navbar (MenuItem dinamis 3 level) → Hero → konten → CTA SPMB → Footer (identitas + SEO).
- Admin: Sidebar (ikon + label, collapse) → Topbar (search, theme toggle, profil) → content card radius-21 → tabel standar.
- State: loading skeleton (bukan spinner penuh), empty state dengan CTA, error state dengan tombol ulangi.
- Bahasa: Indonesia. Format tanggal: `id-ID` (mis. 20 Oktober 2026).

## 5. Aksesibilitas & SEO
- Kontras ≥ 4.5:1, fokus visible, alt pada semua gambar, label pada form.
- SEO: title/desc/keyword dari SiteSetting, OG tags, slug unik, sitemap + robots (T-013).
