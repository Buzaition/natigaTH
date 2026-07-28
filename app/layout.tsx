import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نتيجة الثانوية العامة",
  description: "ابحث عن نتيجة الثانوية العامة باستخدام رقم الجلوس فقط.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
