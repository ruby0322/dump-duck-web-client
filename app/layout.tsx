import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "別亂丟鴨 - AI 文件管理助手",
  description:
    "別亂丟鴨是一個專為大學生設計的 AI 文件管理助手，幫助你快速整理筆記、搜尋課堂資料，甚至找到遺忘的檔案。讓學習更高效，生活更有條理，從此告別資料亂丟的煩惱！",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
