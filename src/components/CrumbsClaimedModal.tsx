import React from 'react';
import Image from 'next/image';
import { Button } from './Button';

export default function CrumbsClaimedModal() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-2xl w-full mx-4 p-12 bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <Image
          src="/images/crumpet-logo.png"
          alt="Crumpet Logo"
          width={140}
          height={140}
          priority
          className="mb-8 w-[140px] h-[140px]"
        />
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-silver via-bright-teal to-custom-teal text-transparent bg-clip-text mb-2">
          All CRUMBS have been claimed!
        </h2>
        <p className="text-lg text-gray-200 mb-8">
          Crumpet Media expects to launch about one month after the mainnet release of an EVM Layer 2 on Kaspa.
        </p>
        <div className="flex flex-row gap-4 w-full max-w-xs mx-auto mb-6 justify-center">
          <a
            href="/docs/whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">
              Whitepaper
            </Button>
          </a>
          <a
            href="https://kas.fyi/token/krc20/CRUMBS"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="secondary" className="w-full">
              $CRUMBS
            </Button>
          </a>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          For the latest news and updates, follow us on{' '}
          <a
            href="https://x.com/crumpet_media"
            target="_blank"
            rel="noopener noreferrer"
            className="text-bright-teal underline hover:text-custom-teal transition-colors"
          >
            X (Twitter)
          </a>
        </p>
      </div>
    </div>
  );
} 