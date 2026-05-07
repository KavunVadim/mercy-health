"use client";

import { ThemeProvider as NextThemeProvider } from "@teispace/next-themes";
import { type ReactNode } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem={true}
      storageKey="mercy-health-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
