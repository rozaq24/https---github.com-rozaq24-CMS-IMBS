"use client";
import { SessionProvider } from "next-auth/react";
import { SoundProvider } from "echo-ui-core/sound";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SoundProvider>{children}</SoundProvider>
    </SessionProvider>
  );
}
