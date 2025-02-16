// Note: In a production environment, you would want to use a more secure way to store the API secret
const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET || 'your-default-secret-key';

export async function generateSignature(data: string, timestamp: number): Promise<string> {
    // In the browser, we'll use the Web Crypto API for HMAC
    const encoder = new TextEncoder();
    const key = encoder.encode(API_SECRET);
    const message = encoder.encode(`${data}:${timestamp}`);
    
    // Create HMAC
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
    
    // Convert to hex string
    return Array.from(new Uint8Array(signature))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
} 