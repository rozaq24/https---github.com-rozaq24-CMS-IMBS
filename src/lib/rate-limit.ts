const requests = new Map<string, { count: number; resetAt: number }>();

// ponytail: batas per proses, bukan lintas server; ganti ke store bersama bila app dijalankan multi-instance.
export function allowRequest(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  requests.forEach((entry, ip) => { if (entry.resetAt <= now) requests.delete(ip); });
  const entry = requests.get(key);
  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
