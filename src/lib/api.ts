import { ApiResponse, Claim } from '@/types';
import { generateSignature, generateNonce } from './security';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function signedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const timestamp = Date.now();
    const nonce = generateNonce();
    
    // Prepare the data for signing
    const data = JSON.stringify({
        method: options.method || 'GET',
        url: url.replace(API_BASE_URL, ''),
        body: options.body,
        nonce
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