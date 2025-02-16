'use client';

import { useState } from 'react';
import { Button } from './Button';
import { submitClaim } from '@/lib/api';

const KASPA_ADDRESS_REGEX = /^kaspa:[a-z0-9]{61,63}$/;

export function ClaimForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!KASPA_ADDRESS_REGEX.test(walletAddress)) {
            setError('Please enter a valid Kaspa wallet address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await submitClaim(walletAddress);
            if (response.success) {
                setSuccess(true);
                setWalletAddress('');
            } else {
                setError(response.error || 'Failed to submit claim');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-black/40 backdrop-blur-sm rounded-lg">
            <h1 className="text-3xl font-bold text-white mb-4">
                Claim $CRUMBS Tokens Free
            </h1>
            <p className="text-gray-400 mb-8">
                CRUMBS tokens are the foundation of the Crumpet Media platform,
                enabling content creators and consumers to participate in the future of
                crypto-native media. Enter your KRC-20 wallet address below to claim
                your tokens.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="wallet"
                        className="block text-sm font-medium text-gray-300 mb-2"
                    >
                        Kaspa Wallet Address
                    </label>
                    <input
                        id="wallet"
                        type="text"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value.toLowerCase())}
                        placeholder="kaspa:..."
                        pattern="^kaspa:[a-z0-9]{61,63}$"
                        className="w-full px-4 py-3 bg-black/40 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your Kaspa wallet address starting with "kaspa:"
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                {success && (
                    <div className="text-green-500 text-sm">
                        Claim submitted successfully!
                    </div>
                )}

                <Button type="submit" isLoading={isLoading}>
                    Claim Tokens
                </Button>
            </form>
        </div>
    );
} 