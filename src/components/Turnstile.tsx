'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface TurnstileProps {
    onVerify: () => void;
}

export default function Turnstile({ onVerify }: TurnstileProps) {
    useEffect(() => {
        // Initialize turnstile when the component mounts
        const turnstileCallback = () => {
            // @ts-ignore - turnstile is added by the script
            window.turnstile.render('#turnstile-container', {
                sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
                theme: 'dark',
                callback: (token: string) => {
                    console.log('Captcha verified');
                    onVerify();
                },
            });
        };

        // If turnstile is already loaded, initialize immediately
        // @ts-ignore - turnstile is added by the script
        if (window.turnstile) {
            turnstileCallback();
        } else {
            // Otherwise, wait for the script to load
            window.onloadTurnstileCallback = turnstileCallback;
        }

        return () => {
            // Cleanup if needed
            delete window.onloadTurnstileCallback;
        };
    }, [onVerify]);

    return (
        <>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
                async
                defer
            />
            <div id="turnstile-container" className="flex justify-center" />
        </>
    );
} 