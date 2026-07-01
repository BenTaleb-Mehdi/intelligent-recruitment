import React from "react";
import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "Dashboard Auth TypeScript",
  description: "MERN Stack with Better Auth and HeroUI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}