import sanitizeHtml from "sanitize-html";

// Buat slug URL-friendly: "Berita Sekolah!" -> "berita-sekolah"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

// Cari slug unik: "berita" -> "berita-2" bila sudah dipakai (cek via exists fn)
export async function uniqueSlug(base: string, exists: (slug: string) => Promise<boolean>): Promise<string> {
  let slug = slugify(base);
  let i = 2;
  while (await exists(slug)) {
    slug = `${slugify(base)}-${i}`;
    i++;
  }
  return slug;
}

// Bersihkan HTML TipTap agar aman dari XSS saat render publik
export function cleanHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "a", "img", "hr", "pre", "code",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tag, attribs) => ({ tagName: "a", attribs: { ...attribs, target: "_blank", rel: "noopener noreferrer" } }),
    },
  });
}

// Tentukan apakah post terjadwal sudah waktunya terbit
export function isDueToPublish(status: string, publishedAt: Date | string | null | undefined, now = new Date()): boolean {
  if (status !== "SCHEDULED" || !publishedAt) return false;
  return new Date(publishedAt).getTime() <= now.getTime();
}
