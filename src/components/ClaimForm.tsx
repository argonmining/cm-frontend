'use client';

import { useState, useCallback } from 'react';
import { Button } from './Button';
import { submitClaim, getClaims } from '@/lib/api';
import type { Claim } from '@/types';
import Turnstile from './Turnstile';

const KASPA_ADDRESS_REGEX = /^kaspa:[a-z0-9]{61,63}$/;

export function ClaimForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [error, setError] = useState('');
    const [claimHistory, setClaimHistory] = useState<Claim[]>([]);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

    const loadClaimHistory = async (address: string) => {
        setIsLoadingHistory(true);
        try {
            const response = await getClaims(address);
            if (response.success && response.data) {
                setClaimHistory(response.data);
                if (response.data.length === 0) {
                    setError('No claims found for this wallet address');
                }
            } else {
                setError(response.error || 'Failed to fetch claim history');
            }
        } catch {
            setError('An unexpected error occurred while fetching claim history');
        } finally {
            setIsLoadingHistory(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!KASPA_ADDRESS_REGEX.test(walletAddress)) {
            setError('Please enter a valid Kaspa wallet address');
            return;
        }

        if (!isCaptchaVerified) {
            setError('Please complete the captcha verification');
            return;
        }

        setIsLoading(true);

        try {
            const response = await submitClaim(walletAddress);
            if (response.success && response.data) {
                // Load claim history after successful claim
                await loadClaimHistory(walletAddress);
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

    const handleViewHistory = async () => {
        setError('');

        if (!KASPA_ADDRESS_REGEX.test(walletAddress)) {
            setError('Please enter a valid Kaspa wallet address');
            return;
        }

        if (!isCaptchaVerified) {
            setError('Please complete the captcha verification');
            return;
        }

        await loadClaimHistory(walletAddress);
    };

    const onCaptchaVerify = useCallback(() => {
        setIsCaptchaVerified(true);
    }, []);

    const renderClaimHistory = () => {
        if (claimHistory.length === 0) return null;

        return (
            <div className="mt-8 space-y-3">
                <h3 className="text-lg font-medium text-white">Claim History</h3>
                {claimHistory.map((claim) => (
                    <div key={claim.id} className="p-4 bg-black/20 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                    claim.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                    claim.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                }`}>
                                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                </span>
                                <p className="text-sm text-gray-400 mt-2">
                                    Amount: {claim.amount} $CRUMBS
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(claim.created_at).toLocaleString()}
                                </p>
                            </div>
                            {claim.transaction_hash && (
                                <a
                                    href={`https://kas.fyi/transaction/${claim.transaction_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-indigo-400 hover:text-indigo-300"
                                >
                                    View Transaction ↗
                                </a>
                            )}
                        </div>
                        {claim.transaction_error && (
                            <p className="text-sm text-red-400 mt-2">
                                Error: {claim.transaction_error}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-black/40 backdrop-blur-sm rounded-lg">
            <h1 className="text-3xl font-bold text-white mb-4">
                Claim $CRUMBS Tokens
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
                        disabled={isLoading || isLoadingHistory}
                    />
                    <p className="mt-2 text-sm text-gray-400">
                        Enter your Kaspa wallet address starting with &ldquo;kaspa:&rdquo;
                    </p>
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <div className="flex justify-center">
                    <Turnstile onVerify={onCaptchaVerify} />
                </div>

                <div className="flex gap-4">
                    <Button 
                        type="submit" 
                        isLoading={isLoading} 
                        disabled={isLoading || isLoadingHistory || !isCaptchaVerified}
                        className="flex-1"
                    >
                        Claim Tokens
                    </Button>
                    <Button 
                        type="button"
                        variant="secondary"
                        onClick={handleViewHistory}
                        isLoading={isLoadingHistory}
                        disabled={isLoading || isLoadingHistory || !isCaptchaVerified}
                        className="flex-1"
                    >
                        View History
                    </Button>
                </div>
            </form>

            {renderClaimHistory()}
        </div>
    );
} 