import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublicImage } from "@/components/PublicImage";

export type Greeting = { title: string; body: string; principalName: string; photo: string | null; active: boolean };

export function GreetingCard({ greeting, compact = false }: { greeting: Greeting | null; compact?: boolean }) {
  if (!greeting || !greeting.active) return null;
  const paragraphs = greeting.body.split(/\n{2,}|\r\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean);
  return (
    <Card className={`greeting-story ${compact ? "greeting-story--compact" : ""}`} as="section">
      <div className="greeting-story__visual">
        {greeting.photo ? (
          <PublicImage src={greeting.photo} alt={greeting.principalName} fallbackLabel={greeting.principalName} className="greeting-story__image" />
        ) : (
          <div className="greeting-brand-placeholder greeting-story__image">
            <img src="/brand/imbs-logo.png" alt="" aria-hidden="true" />
            <span>International Muhammadiyah Boarding School</span>
          </div>
        )}
        <span className="greeting-story__image-note">IMBS · {greeting.title}</span>
      </div>
      <div className="greeting-story__copy">
        <p className="public-kicker">{greeting.title}</p>
        <h2 className="font-display">{greeting.principalName}</h2>
        <Quote aria-hidden="true" className="greeting-story__quote-mark" />
        <div className="greeting-story__body">
          {(compact ? paragraphs.slice(0, 1) : paragraphs).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
        {compact && <Button asChild variant="outline"><Link href="/sambutan">Baca sambutan lengkap <ArrowUpRight aria-hidden="true" data-icon="inline-end" /></Link></Button>}
      </div>
    </Card>
  );
}
