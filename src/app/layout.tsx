import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CrumbsClaimedModal from '@/components/CrumbsClaimedModal';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Claim $CRUMBS Tokens | Crumpet Media",
  description: "Claim your $CRUMBS tokens and participate in the future of crypto-native media.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CrumbsClaimedModal />
        {children}
      </body>
    </html>
  );
}