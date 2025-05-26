import React from 'react';

export default function CrumbsClaimedModal() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative max-w-lg w-full mx-4 p-8 bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col items-center text-center">
        <div className="mb-6">
          <svg width="64" height="64" fill="none" viewBox="0 0 64 64" aria-hidden="true" className="mx-auto mb-4">
            <circle cx="32" cy="32" r="32" fill="#FFD700" fillOpacity="0.15" />
            <path d="M20 44c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx="32" cy="28" rx="6" ry="7" fill="#FFD700" fillOpacity="0.7" />
          </svg>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-200 to-yellow-400 text-transparent bg-clip-text mb-2">All CRUMBS have been claimed!</h2>
        </div>
        <p className="text-lg text-gray-200 mb-4">
          Crumpet Media expects to launch about one month after the mainnet release of an EVM Layer 2 on Kaspa.
        </p>
        <p className="text-sm text-gray-400">Thank you for your interest and support. Stay tuned for updates!</p>
      </div>
    </div>
  );
} 