// Root Layout
// 루트 레이아웃

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "🏃 japanguru | 일본 러닝화 구매대행",
  description: "japanguru - 일본 러닝화 해외 구매 대행 플랫폼. 아식스, 뉴발란스, 미즈노 등 한정판 및 발볼 넓은 러닝화 전문",
  keywords: "japanguru, 일본 러닝화, 아식스, 뉴발란스, 미즈노, 해외구매대행, 한정판, 발볼넓은",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
