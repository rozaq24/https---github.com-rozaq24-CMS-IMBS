import { db } from "../src/lib/db";
import { FAQ } from "../src/lib/faq";
import { DEFAULT_PUBLIC_MENU } from "../src/lib/menus";
import bcrypt from "bcryptjs";

async function main() {
  const passwordHash = await bcrypt.hash("ImbsDemo!2026", 10);
  const users = [
    ["admin@sekolah.sch.id", "Super Admin", "SUPERADMIN"],
    ["operator.berita@sekolah.sch.id", "Operator Berita", "OPERATOR_BERITA"],
    ["operator.spmb@sekolah.sch.id", "Operator SPMB", "OPERATOR_SPMB"],
    ["guru@sekolah.sch.id", "Guru Demo", "GURU"],
    ["wali@sekolah.sch.id", "Wali Demo", "WALI_READONLY"],
  ] as const;
  const admin = await db.user.upsert({ where: { email: users[0][0] }, update: { name: users[0][1], role: users[0][2], passwordHash, active: true }, create: { email: users[0][0], name: users[0][1], role: users[0][2], passwordHash } });
  for (const [email, name, role] of users.slice(1)) await db.user.upsert({ where: { email }, update: { name, role, passwordHash, active: true }, create: { email, name, role, passwordHash } });

  const settings = [
    ["site.theme", "emerald"],
    ["site.identity", JSON.stringify({ siteTitle: "CMS IMBS", description: "Informasi profil, berita, dan layanan sekolah IMBS.", keywords: "IMBS, sekolah, pendidikan", logo: "", favicon: "", address: "", phone: "", email: "", mapUrl: "", facebook: "", instagram: "", youtube: "" })],
    ["site.faq", JSON.stringify(FAQ)],
  ];
  for (const [key, value] of settings) await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });

  await db.greeting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, title: "Sambutan Kepala Sekolah", body: "Selamat datang di website resmi sekolah IMBS. Mari belajar, berkarya, dan tumbuh bersama.", principalName: "Kepala Sekolah" } });
  const pages = [
    ["visi-misi", "Visi dan Misi", "<h2>Visi</h2><p>Mewujudkan peserta didik yang berilmu, berkarakter, dan siap berkontribusi.</p><h2>Misi</h2><p>Menyelenggarakan pembelajaran yang aman, terarah, dan mendorong potensi setiap murid.</p>"],
    ["sejarah", "Sejarah Sekolah", "<p>Halaman demo ini menunggu riwayat resmi sekolah dari pengelola. Ganti konten contoh melalui menu halaman di admin.</p>"],
    ["kontak", "Kontak", "<p>Hubungi sekolah melalui informasi kontak resmi pada footer atau kirim pesan melalui formulir pengaduan.</p>"],
    ["budaya-belajar", "Budaya Belajar", "<p>Contoh halaman untuk meninjau informasi kegiatan belajar, kebiasaan membaca, dan kerja kelompok. Ganti seluruh isi dengan kebijakan resmi sekolah sebelum situs dipublikasikan.</p><h2>Belajar bersama</h2><p>Murid berlatih menyampaikan gagasan, bertanya, dan menyelesaikan tugas secara bertahap. Guru mendampingi proses belajar sesuai kebutuhan kelas.</p><h2>Ruang yang mendukung</h2><p>Perpustakaan, ruang kelas, dan kegiatan bersama menjadi contoh ruang belajar yang dapat diperkenalkan pada halaman ini.</p>"],
    ["fasilitas-sekolah", "Fasilitas Sekolah", "<p>Halaman contoh fasilitas sekolah untuk kebutuhan review tampilan. Sesuaikan nama ruang, foto, dan jam penggunaan berdasarkan data resmi.</p><h2>Ruang belajar</h2><p>Informasi ruang kelas, laboratorium, perpustakaan, dan fasilitas pendukung dapat dijelaskan di sini.</p><h2>Layanan murid</h2><p>Tambahkan petunjuk akses, jadwal layanan, serta narahubung yang sudah diverifikasi oleh pengelola.</p>"],
    ["layanan-murid", "Layanan Murid", "<p>Ringkasan contoh layanan yang membantu murid dan keluarga menemukan informasi sekolah.</p><ul><li>Informasi kegiatan dan agenda sekolah.</li><li>Pusat unduhan formulir dan dokumen.</li><li>Formulir pesan untuk pertanyaan atau masukan.</li></ul><p>Konten ini adalah data demo dan perlu ditinjau sebelum digunakan sebagai informasi resmi.</p>"],
  ] as const;
  for (const [slug, title, content] of pages) await db.customPage.upsert({ where: { slug }, update: {}, create: { slug, title, content, showInMenu: true } });

  const posts = [
    ["kegiatan-belajar", "Kegiatan Belajar di Sekolah", "Berita", "Murid mengikuti kegiatan pembelajaran dan diskusi di kelas."],
    ["pengumuman-akademik", "Pengumuman Akademik", "Pengumuman", "Periksa informasi akademik terbaru melalui kanal resmi sekolah."],
    ["agenda-kegiatan", "Agenda Kegiatan Sekolah", "Agenda", "Jadwal kegiatan sekolah akan diperbarui pada halaman agenda."],
    ["karya-murid", "Karya dan Kreativitas Murid", "Artikel", "Sekolah mendukung murid untuk terus berkarya dan berbagi."],
    ["kegiatan-literasi", "Mendorong Budaya Literasi", "Berita", "Kegiatan literasi menjadi bagian dari pengalaman belajar murid."],
    ["informasi-layanan", "Informasi Layanan Sekolah", "Pengumuman", "Gunakan halaman layanan untuk menemukan informasi yang tersedia."],
    ["belajar-bersama", "Belajar dan Tumbuh Bersama", "Artikel", "Lingkungan belajar yang baik membantu murid mengembangkan potensinya."],
    ["kabar-sekolah", "Kabar Sekolah IMBS", "Berita", "Berita demo ini dapat diganti oleh operator berita melalui admin."],
    ["kelas-kolaboratif", "Belajar Lewat Proyek Kolaboratif", "Berita", "Contoh kegiatan kelas untuk melihat tampilan berita dengan ringkasan yang lebih lengkap. Murid menyusun gagasan, membagi tugas, lalu mempresentasikan hasilnya bersama."],
    ["pekan-literasi", "Pekan Literasi dan Karya Murid", "Artikel", "Contoh artikel tentang kebiasaan membaca, diskusi buku, dan karya tulis murid. Konten ini disediakan untuk review layout dan dapat diganti dari dashboard admin."],
    ["informasi-spmb-2027", "Informasi Penerimaan Murid Baru", "Pengumuman", "Informasi penerimaan untuk tahun ajaran berikutnya masih berupa contoh. Periksa jadwal, persyaratan, dan kontak resmi sebelum mengumumkannya kepada calon keluarga."],
    ["agenda-kelas-terbuka", "Kelas Terbuka untuk Keluarga", "Agenda", "Contoh agenda pertemuan keluarga dan guru. Waktu dan lokasi final akan diumumkan oleh sekolah melalui kanal resminya."],
  ] as const;
  for (let index = 0; index < posts.length; index++) {
    const [slug, title, type, excerpt] = posts[index];
    const publishedAt = index < 8
      ? new Date(Date.UTC(2026, 0, 5 + index))
      : new Date(Date.UTC(2026, 9, 5 + index - 8));
    await db.post.upsert({
      where: { slug },
      update: index >= 8 ? { publishedAt } : {},
      create: { slug, title, type: type.toUpperCase(), excerpt, content: `<p>${excerpt}</p>`, cover: `https://picsum.photos/seed/imbs-${slug}/960/640`, status: "PUBLISHED", publishedAt, authorId: admin.id },
    });
  }

  const major = await db.major.upsert({ where: { code: "DEMO" }, update: {}, create: { code: "DEMO", name: "Program Contoh", desc: "Ganti informasi demo ini dengan program resmi sekolah." } });
  const teacher = await db.teacher.upsert({ where: { nip: "DEMO-GURU-001" }, update: {}, create: { nip: "DEMO-GURU-001", name: "Guru Demo", position: "Guru", education: "Data demo; perbarui melalui admin." } });
  const classroom = await db.classRoom.upsert({ where: { name: "Kelas Contoh" }, update: {}, create: { name: "Kelas Contoh", year: "2026/2027", majorId: major.id, homeroomTeacherId: teacher.id } });
  const student = await db.student.upsert({ where: { nis: "DEMO-001" }, update: {}, create: { nis: "DEMO-001", name: "Murid Demo", gender: "L", classId: classroom.id, year: "2026/2027", status: "AKTIF" } });
  if (!await db.achievement.findFirst({ where: { title: "Prestasi Contoh" } })) await db.achievement.create({ data: { title: "Prestasi Contoh", level: "Sekolah", year: "2026", desc: "Ganti dengan prestasi resmi.", studentId: student.id } });
  await db.extracurricular.upsert({ where: { name: "Kegiatan Contoh" }, update: {}, create: { name: "Kegiatan Contoh", schedule: "Jadwal diumumkan sekolah", desc: "Informasi demo kegiatan ekstrakurikuler." } });
  if (!await db.agenda.findFirst({ where: { title: "Agenda Contoh" } })) await db.agenda.create({ data: { title: "Agenda Contoh", desc: "Perbarui dengan jadwal resmi sekolah.", location: "Sekolah", startAt: new Date("2026-12-01T02:00:00.000Z") } });

  const demoMajors = await Promise.all([
    db.major.upsert({ where: { code: "DEMO-ACADEMIC-01" }, update: {}, create: { code: "DEMO-ACADEMIC-01", name: "Sains Terapan", desc: "Contoh program sains untuk menampilkan kartu akademik. Ganti dengan program resmi." } }),
    db.major.upsert({ where: { code: "DEMO-ACADEMIC-02" }, update: {}, create: { code: "DEMO-ACADEMIC-02", name: "Bahasa dan Literasi", desc: "Contoh program bahasa dan literasi untuk review halaman publik." } }),
  ]);
  const demoTeachers = await Promise.all([
    db.teacher.upsert({ where: { nip: "DEMO-GURU-002" }, update: {}, create: { nip: "DEMO-GURU-002", name: "Ahmad Hidayat", position: "Guru Sains", education: "Data profil contoh" } }),
    db.teacher.upsert({ where: { nip: "DEMO-GURU-003" }, update: {}, create: { nip: "DEMO-GURU-003", name: "Siti Rahmah", position: "Guru Bahasa", education: "Data profil contoh" } }),
    db.teacher.upsert({ where: { nip: "DEMO-GURU-004" }, update: {}, create: { nip: "DEMO-GURU-004", name: "Fadli Hakim", position: "Pembina Kegiatan", education: "Data profil contoh" } }),
  ]);
  const demoClasses = await Promise.all([
    db.classRoom.upsert({ where: { name: "Kelas 10 Demo" }, update: {}, create: { name: "Kelas 10 Demo", year: "2026/2027", majorId: demoMajors[0].id, homeroomTeacherId: demoTeachers[0].id } }),
    db.classRoom.upsert({ where: { name: "Kelas 11 Demo" }, update: {}, create: { name: "Kelas 11 Demo", year: "2026/2027", majorId: demoMajors[1].id, homeroomTeacherId: demoTeachers[1].id } }),
  ]);
  const demoStudents = [
    ["DEMO-002", "Murid Contoh 02", "P", demoClasses[0].id],
    ["DEMO-003", "Murid Contoh 03", "L", demoClasses[0].id],
    ["DEMO-004", "Murid Contoh 04", "P", demoClasses[1].id],
    ["DEMO-005", "Murid Contoh 05", "L", demoClasses[1].id],
  ] as const;
  for (const [nis, name, gender, classId] of demoStudents) {
    await db.student.upsert({ where: { nis }, update: {}, create: { nis, name, gender, classId, year: "2026/2027", status: "AKTIF" } });
  }
  for (const title of ["Literasi dan Menulis", "Klub Sains", "Kepemimpinan Murid"]) {
    await db.extracurricular.upsert({ where: { name: title }, update: {}, create: { name: title, schedule: "Jadwal contoh", desc: "Contoh kegiatan untuk review. Sesuaikan jadwal dan informasi dengan data sekolah." } });
  }
  for (const [title, level] of [["Pameran Karya Murid", "Sekolah"], ["Lomba Literasi", "Wilayah"]]) {
    if (!await db.achievement.findFirst({ where: { title } })) await db.achievement.create({ data: { title, level, year: "2026", desc: "Contoh prestasi untuk meninjau tampilan halaman publik." } });
  }
  for (const [title, desc, date] of [
    ["Pekan Literasi", "Contoh agenda diskusi buku dan pameran karya tulis murid.", "2026-11-05T02:00:00.000Z"],
    ["Pertemuan Keluarga dan Guru", "Contoh agenda komunikasi sekolah dan keluarga murid.", "2026-11-14T02:00:00.000Z"],
    ["Pameran Proyek Kelas", "Murid memperlihatkan hasil proyek belajar kepada pengunjung.", "2026-12-12T02:00:00.000Z"],
  ] as const) {
    if (!await db.agenda.findFirst({ where: { title } })) await db.agenda.create({ data: { title, desc, location: "Sekolah (contoh)", startAt: new Date(date) } });
  }

  const albums = [];
  for (const title of ["Kegiatan Contoh", "Literasi Contoh", "Proyek Kelas Contoh"]) albums.push(await db.album.findFirst({ where: { title } }) ?? await db.album.create({ data: { title, category: "Demo" } }));
  if (!await db.photo.findFirst({ where: { albumId: albums[0].id } })) await db.photo.create({ data: { albumId: albums[0].id, url: "https://picsum.photos/seed/imbs-school/960/640", caption: "Foto demo — ganti dengan dokumentasi sekolah." } });
  if (!await db.photo.findFirst({ where: { albumId: albums[1].id } })) await db.photo.create({ data: { albumId: albums[1].id, url: "https://picsum.photos/seed/imbs-literasi/960/640", caption: "Foto demo literasi — ganti dengan dokumentasi sekolah." } });
  for (const [albumIndex, url, caption] of [
    [0, "https://picsum.photos/seed/imbs-campus/960/640", "Ruang kegiatan sekolah (foto demo)."],
    [1, "https://picsum.photos/seed/imbs-reading/960/640", "Ruang baca (foto demo)."],
    [2, "https://picsum.photos/seed/imbs-project/960/640", "Pameran proyek kelas (foto demo)."],
  ] as const) {
    const albumId = albums[albumIndex].id;
    if (!await db.photo.findFirst({ where: { albumId, url } })) await db.photo.create({ data: { albumId, url, caption } });
  }
  await db.sPMBPeriod.upsert({ where: { id: "demo-spmb-2026" }, update: {}, create: { id: "demo-spmb-2026", name: "Periode Demo", year: "2026", quota: 100, openAt: new Date("2026-01-01T00:00:00.000Z"), closeAt: new Date("2026-12-31T23:59:59.000Z"), terms: "Periode demo. Perbarui persyaratan resmi sebelum digunakan.", active: true } });

  for (const { id, label, href, parentId, order, visible, target, pageSlug } of DEFAULT_PUBLIC_MENU) {
    await db.menuItem.upsert({ where: { id }, update: {}, create: { id, label, href, parentId, order, visible, target, pageSlug } });
  }
  console.log(`Seed demo selesai: ${users.length} akun, ${posts.length} berita, ${albums.length} album, ${demoTeachers.length + 1} guru, ${demoStudents.length + 1} murid, halaman profil, agenda, SPMB, dan FAQ. Login demo: ${users.map(([email]) => email).join(", ")} / ImbsDemo!2026`);
}

main().finally(() => db.$disconnect());
