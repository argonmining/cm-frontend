import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'edge'; // Required for Cloudflare Pages

export async function GET() {
    const headersList = await headers();
    
    // Cloudflare-specific headers for client IP
    const ip = headersList.get('cf-connecting-ip') || 
               headersList.get('x-real-ip') || 
               headersList.get('x-forwarded-for');

    if (!ip) {
        return NextResponse.json({
            success: false,
            error: 'Could not determine IP address'
        }, { status: 400 });
    }

    try {
        const apiKey = process.env.VPNAPI_KEY;
        
        if (!apiKey) {
            console.error('VPNAPI_KEY not configured');
            return NextResponse.json({
                success: false,
                error: 'VPN check service not configured'
            }, { status: 500 });
        }

        const response = await fetch(`https://vpnapi.io/api/${ip}?key=${apiKey}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json({
                success: false,
                error: data.message || 'VPN check failed'
            }, { status: response.status });
        }

        const detectionTypes: string[] = [];
        if (data.security?.vpn) detectionTypes.push('VPN');
        if (data.security?.proxy) detectionTypes.push('Proxy');
        if (data.security?.tor) detectionTypes.push('Tor');
        if (data.security?.relay) detectionTypes.push('Relay');

        return NextResponse.json({
            success: true,
            data: {
                isUsingVPN: detectionTypes.length > 0,
                details: detectionTypes.length > 0 ? {
                    country: data.location?.country,
                    detectionType: detectionTypes
                } : undefined
            }
        });
    } catch (error) {
        console.error('VPN check error:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to check VPN status'
        }, { status: 500 });
    }
} 