"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";

type PublicImageProps = ImgHTMLAttributes<HTMLImageElement> & { fallbackLabel?: string };

export function PublicImage({ src, alt = "", className, fallbackLabel, onError, ...props }: PublicImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  if (failed || !src) {
    const label = fallbackLabel || alt || "Dokumentasi Sekolah IMBS";
    return (
      <div className={`public-image-fallback ${className || ""}`} role={alt ? "img" : undefined} aria-label={alt ? label : undefined} aria-hidden={alt ? undefined : true}>
        <img src="/brand/imbs-logo.png" alt="" aria-hidden="true" />
        <span>{label}</span>
      </div>
    );
  }

  return <img {...props} src={src} alt={alt} className={className} onError={(event) => { setFailed(true); onError?.(event); }} />;
}
