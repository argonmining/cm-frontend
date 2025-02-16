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
            const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
            if (!siteKey) {
                console.error('Turnstile site key is not configured');
                return;
            }

            if (window.turnstile) {
                window.turnstile.render('#turnstile-container', {
                    sitekey: siteKey,
                    theme: 'dark',
                    callback: function() {
                        console.log('Captcha verified');
                        onVerify();
                    },
                });
            }
        };

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