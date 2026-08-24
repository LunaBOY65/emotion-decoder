// Dynamic meta tags สำหรับ Mobile PWA/Social preview
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Emotion Decoder | ถอดรหัสความรู้สึก",
  description: "ถอดรหัสความรู้สึกที่ไม่รู้จะอธิบายอย่างไร",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <body className="bg-neutral-950 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
