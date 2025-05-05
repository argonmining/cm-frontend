import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

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
        {/* Maintenance Overlay - remove or comment out to disable maintenance mode */}
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 text-white select-none">
          <Image src="/images/crumpet-logo.png" alt="Crumpet Media Logo" width={120} height={120} className="mb-6" />
          <div className="text-3xl font-bold mb-2">Temporary Maintenance</div>
          <div className="text-lg text-gray-300">We&rsquo;ll be back soon!</div>
        </div>
        {/* End Maintenance Overlay */}
        {children}
      </body>
    </html>
  );
}
