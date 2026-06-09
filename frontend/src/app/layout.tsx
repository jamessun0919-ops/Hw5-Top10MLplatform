import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TOP10ML - 機器學習十大演算法互動學習平台",
  description: "互動式機器學習演算法學習平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0e27]">
        {children}
      </body>
    </html>
  );
}
