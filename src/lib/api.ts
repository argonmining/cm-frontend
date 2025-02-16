import { ApiResponse, Claim } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function submitClaim(walletAddress: string): Promise<ApiResponse<Claim>> {
    try {
        const response = await fetch(`${API_BASE_URL}/claim`, {
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
        const response = await fetch(`${API_BASE_URL}/claims/${walletAddress}`);
        
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