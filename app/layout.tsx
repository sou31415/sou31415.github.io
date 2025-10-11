import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap"
});

export const metadata: Metadata = {
  title: {
    default: "Liquid Glass Portfolio",
    template: "%s | Liquid Glass Portfolio"
  },
  description: "軽量なLiquid Glassスタイルでまとめたシンプルなポートフォリオ",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={notoSansJp.className}>{children}</body>
    </html>
  );
}
