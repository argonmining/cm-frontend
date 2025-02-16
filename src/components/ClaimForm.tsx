'use client';

import { useState } from 'react';
import { Button } from './Button';
import { submitClaim } from '@/lib/api';
import type { Claim } from '@/types';

const KASPA_ADDRESS_REGEX = /^kaspa:[a-z0-9]{61,63}$/;

export function ClaimForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [claimResult, setClaimResult] = useState<Claim | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setClaimResult(null);

        if (!KASPA_ADDRESS_REGEX.test(walletAddress)) {
            setError('Please enter a valid Kaspa wallet address');
            return;
        }

        setIsLoading(true);

        try {
            const response = await submitClaim(walletAddress);
            if (response.success && response.data) {
                setClaimResult(response.data);
                setWalletAddress('');
            } else {
                setError(response.error || 'Failed to submit claim');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const renderClaimStatus = () => {
        if (!claimResult) return null;

        const statusColors = {
            processing: 'text-yellow-500',
            completed: 'text-green-500',
            failed: 'text-red-500'
        };

        return (
            <div className="mt-4 p-4 bg-black/20 rounded-lg">
                <h3 className={`text-lg font-medium ${statusColors[claimResult.status]}`}>
                    Claim Status: {claimResult.status.charAt(0).toUpperCase() + claimResult.status.slice(1)}
                </h3>
                {claimResult.transaction_hash && (
                    <p className="text-sm text-gray-300 mt-2">
                        Transaction Hash: <a 
                            href={`https://explorer.kaspa.org/txs/${claimResult.transaction_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300"
                        >
                            {claimResult.transaction_hash}
                        </a>
                    </p>
                )}
                {claimResult.transaction_error && (
                    <p className="text-sm text-red-400 mt-2">
                        Error: {claimResult.transaction_error}
                    </p>
                )}
                <p className="text-sm text-gray-400 mt-2">
                    Amount: {claimResult.amount} $CRUMBS
                </p>
            </div>
        );
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
                        disabled={isLoading}
                    />
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your Kaspa wallet address starting with &ldquo;kaspa:&rdquo;
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                {renderClaimStatus()}

                <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                    Claim Tokens
                </Button>
            </form>
        </div>
    );
} 