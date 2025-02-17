import { ApiResponse, Claim } from '@/types';
import { generateSignature, generateNonce } from './security';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const KASPLEX_API_URL = 'https://api.kasplex.org/v1';
const FAUCET_ADDRESS = 'kaspa:qrk00pw5g289ar7r4nc63g6dtduref7rumk00w4vt799udqp3fz8ykzm8zwu5';
const FAUCET_TOKEN = 'CRUMBS';

async function signedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const timestamp = Date.now();
    const nonce = generateNonce();
    
    // Get the relative URL by removing the base URL
    const relativeUrl = url.replace(API_BASE_URL, '');
    
    // Parse body if it's a string (JSON)
    let parsedBody = {};
    if (typeof options.body === 'string') {
        try {
            parsedBody = JSON.parse(options.body);
        } catch {
            parsedBody = {};
        }
    } else if (options.body) {
        parsedBody = options.body;
    }
    
    // Prepare the data for signing
    const data = JSON.stringify({
        method: options.method || 'GET',
        url: relativeUrl,
        body: parsedBody,
        nonce
    });

    console.log('Generating signature with:', {
        method: options.method || 'GET',
        url: relativeUrl,
        body: parsedBody,
        nonce,
        timestamp,
        data
    });

    // Generate signature
    const signature = await generateSignature(data, timestamp);

    // Add security headers
    const headers = {
        ...options.headers,
        'x-signature': signature,
        'x-timestamp': timestamp.toString(),
        'x-nonce': nonce
    };

    return fetch(url, {
        ...options,
        headers
    });
}

export async function submitClaim(walletAddress: string): Promise<ApiResponse<Claim>> {
    try {
        const response = await signedFetch(`${API_BASE_URL}/claim`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                error: errorData.error || 'Failed to submit claim',
            };
        }

        const data = await response.json();
        return data;
    } catch {
        return {
            success: false,
            error: 'Failed to submit claim. Please try again.',
        };
    }
}

export async function getClaims(walletAddress: string): Promise<ApiResponse<Claim[]>> {
    try {
        const response = await signedFetch(`${API_BASE_URL}/claims/${walletAddress}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            return {
                success: false,
                error: errorData.error || 'Failed to fetch claims',
            };
        }

        const data = await response.json();
        return data;
    } catch {
        return {
            success: false,
            error: 'Failed to fetch claims. Please try again.',
        };
    }
}

export async function getFaucetBalance(): Promise<string | null> {
    try {
        const response = await fetch(
            `${KASPLEX_API_URL}/krc20/address/${FAUCET_ADDRESS}/token/${FAUCET_TOKEN}`
        );
        
        if (!response.ok) {
            console.error('Failed to fetch faucet balance');
            return null;
        }

        const data = await response.json();
        if (data.message === 'successful' && data.result?.[0]?.balance) {
            // Handle the balance with BigInt to avoid floating point issues
            const balanceStr = data.result[0].balance;
            const balance = BigInt(balanceStr);
            const divisor = BigInt(10 ** 8);
            
            // Convert to a decimal string safely
            const wholePart = balance / divisor;
            const wholeStr = wholePart.toString();
            const numericValue = Number(wholeStr);
            
            // Format with appropriate suffix
            if (wholePart >= BigInt(1000000)) {
                const millions = numericValue / 1000000;
                return `${millions.toFixed(3)} Million`;
            } else if (wholePart >= BigInt(1000)) {
                const thousands = numericValue / 1000;
                return `${thousands.toFixed(3)} Thousand`;
            } else {
                return numericValue.toLocaleString(undefined, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 3
                });
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching faucet balance:', error);
        return null;
    }
} 