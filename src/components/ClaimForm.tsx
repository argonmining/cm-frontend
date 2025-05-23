'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from './Button';
import { submitClaim, getClaims, getFaucetBalance } from '@/lib/api';
import { checkVPN } from '@/lib/vpnDetection';
import type { Claim } from '@/types';
import ImagePuzzleCaptcha from './ImagePuzzleCaptcha';

const KASPA_ADDRESS_REGEX = /^kaspa:[a-z0-9]{61,63}$/;

export function ClaimForm() {
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [isCheckingVPN, setIsCheckingVPN] = useState(false);
    const [error, setError] = useState('');
    const [claimHistory, setClaimHistory] = useState<Claim[]>([]);
    const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
    const [faucetBalance, setFaucetBalance] = useState<string | null>(null);
    const [vpnError, setVpnError] = useState<string | null>(null);
    const [successTxHash, setSuccessTxHash] = useState<string | null>(null);
    const [captchaKey, setCaptchaKey] = useState(() => Math.random().toString(36));

    useEffect(() => {
        const loadFaucetBalance = async () => {
            const balance = await getFaucetBalance();
            setFaucetBalance(balance);
        };

        loadFaucetBalance();
        // Refresh balance every 5 minutes
        const interval = setInterval(loadFaucetBalance, 5 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Reset captchaKey on every page load (mount)
    useEffect(() => {
        setCaptchaKey(Math.random().toString(36));
    }, []);

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
        setVpnError(null);
        setSuccessTxHash(null);
        setCaptchaKey(Math.random().toString(36)); // Reset captcha on every claim attempt

        if (!KASPA_ADDRESS_REGEX.test(walletAddress)) {
            setError('Please enter a valid Kaspa wallet address');
            return;
        }

        if (!isCaptchaVerified) {
            setError('Please complete the captcha verification');
            return;
        }

        setIsCheckingVPN(true);

        try {
            const vpnCheck = await checkVPN();
            
            if (vpnCheck.error) {
                setError(vpnCheck.error);
                return;
            }

            if (vpnCheck.isUsingVPN) {
                const detectionTypes = vpnCheck.details?.detectionType.join(', ');
                setVpnError(
                    `We detected that you're using ${detectionTypes}. For fair distribution, please disable it and try again.`
                );
                return;
            }

            setIsLoading(true);

            const response = await submitClaim(walletAddress);
            if (response.success && response.data) {
                setSuccessTxHash(response.data.transaction_hash || null);
                // Load claim history after successful claim
                await loadClaimHistory(walletAddress);
                setWalletAddress('');
            } else if (response.data && response.data.transaction_hash) {
                // If transaction_hash exists, treat as success
                setSuccessTxHash(response.data.transaction_hash);
                await loadClaimHistory(walletAddress);
                setWalletAddress('');
            } else {
                setError(response.error || 'Failed to submit claim');
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
            setIsCheckingVPN(false);
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

    const formatAmount = (amount: string): string => {
        // Convert amount to number and divide by 10^8 (8 decimal places)
        const value = parseInt(amount) / Math.pow(10, 8);
        // Format with no decimal places since we're dealing with whole numbers
        return value.toLocaleString();
    };

    const renderClaimHistory = () => {
        if (claimHistory.length === 0) return null;

        return (
            <div className="mt-8 space-y-3">
                <h3 className="text-lg font-medium text-white">Claim History</h3>
                {claimHistory.map((claim) => (
                    <div key={claim.id} className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={`inline-block px-2 py-1 text-xs rounded ${
                                    claim.status === 'completed' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                    claim.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                    'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                </span>
                                <p className="text-sm text-gray-300 mt-2">
                                    Amount: {formatAmount(claim.amount)} $CRUMBS
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
                                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    View Transaction
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
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
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-silver to-custom-teal">
                        $CRUMBS Toaster
                    </h1>
                    {faucetBalance && (
                        <div className="flex flex-col items-end">
                            <a
                                href="https://kas.fyi/address/kaspa:qrk00pw5g289ar7r4nc63g6dtduref7rumk00w4vt799udqp3fz8ykzm8zwu5"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-right"
                            >
                                <div className="text-sm text-gray-400">
                                    Toaster Balance
                                </div>
                                <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-silver to-custom-teal">
                                    {faucetBalance}
                                </div>
                            </a>
                        </div>
                    )}
                </div>
                <p className="text-gray-400 text-lg mb-8">
                    CRUMBS tokens are the foundation of the Crumpet Media platform,
                    enabling content creators and consumers to participate in the future of
                    crypto-native media. Enter your KRC-20 wallet address below to claim
                    your tokens for free. This helps properly & fairly distribute $CRUMBS.
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
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-bright-teal focus:border-transparent transition-all"
                            required
                            disabled={isLoading || isLoadingHistory || isCheckingVPN}
                        />
                        <p className="mt-2 text-sm text-gray-500">
                            Enter your Kaspa wallet address starting with &ldquo;kaspa:&rdquo;
                        </p>
                    </div>

                    {successTxHash && (
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm flex flex-col gap-2">
                            <span>Claim successful! Your transaction is on-chain.</span>
                            <a
                                href={`https://kas.fyi/transaction/${successTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-green-300"
                            >
                                View Transaction
                            </a>
                        </div>
                    )}

                    {!successTxHash && error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {vpnError && (
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
                            {vpnError}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <ImagePuzzleCaptcha key={captchaKey} onVerify={onCaptchaVerify} />
                    </div>

                    <div className="flex gap-4">
                        <Button 
                            type="submit" 
                            isLoading={isLoading || isCheckingVPN} 
                            disabled={isLoading || isLoadingHistory || isCheckingVPN || !isCaptchaVerified}
                            className="flex-1"
                        >
                            {isCheckingVPN ? 'Checking VPN...' : 'Claim Tokens'}
                        </Button>
                        <Button 
                            type="button"
                            variant="secondary"
                            onClick={handleViewHistory}
                            isLoading={isLoadingHistory}
                            disabled={isLoading || isLoadingHistory || isCheckingVPN || !isCaptchaVerified}
                            className="flex-1"
                        >
                            View History
                        </Button>
                    </div>
                </form>
            </div>

            {renderClaimHistory()}
        </div>
    );
} 