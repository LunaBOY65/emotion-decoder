// src\app\layout.tsx
// Dynamic meta tags สำหรับ Mobile PWA/Social preview
import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google"; // 1. นำเข้าฟอนต์ภาษาไทย
import "./globals.css";

// ตั้งค่าฟอนต์ Noto Sans Thai
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Current Mood",
  description: "เข้าใจความรู้สึกตัวเองที่ไม่รู้จะอธิบายอย่างไร",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      {/* เรียกใช้ฟอนต์ที่เตรียมไว้ และเปลี่ยนพื้นหลังเป็นสีสว่าง (bg-neutral-50) */}
      <body
        className={`${notoSansThai.className} bg-neutral-50 text-neutral-900 antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
