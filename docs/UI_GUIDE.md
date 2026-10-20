# UI Guide — Golden Ratio + ReactBits

Sumber: `blueprint/blueprint fitur front end.md#5`. WAJIB diikuti semua halaman.

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
