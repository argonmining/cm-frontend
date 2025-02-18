interface VPNCheckResponse {
    security: {
        vpn: boolean;
        proxy: boolean;
        tor: boolean;
        relay: boolean;
    };
    location: {
        country_code: string;
        country: string;
    };
}

export async function checkVPN(): Promise<{
    isUsingVPN: boolean;
    error?: string;
    details?: {
        country: string;
        detectionType: string[];
    };
}> {
    const apiKey = process.env.NEXT_PUBLIC_VPNAPI_KEY;
    
    if (!apiKey) {
        console.error('VPN API key not configured');
        return { isUsingVPN: false, error: 'VPN detection service not configured' };
    }

    try {
        const response = await fetch(`https://vpnapi.io/api?key=${apiKey}`);
        
        if (!response.ok) {
            throw new Error(`VPN check failed: ${response.statusText}`);
        }

        const data: VPNCheckResponse = await response.json();
        
        // Determine if any security flags are true
        const detectionTypes: string[] = [];
        if (data.security.vpn) detectionTypes.push('VPN');
        if (data.security.proxy) detectionTypes.push('Proxy');
        if (data.security.tor) detectionTypes.push('Tor');
        if (data.security.relay) detectionTypes.push('Relay');

        const isUsingVPN = detectionTypes.length > 0;

        return {
            isUsingVPN,
            details: isUsingVPN ? {
                country: data.location.country,
                detectionType: detectionTypes
            } : undefined
        };
    } catch (error) {
        console.error('Error checking VPN status:', error);
        return {
            isUsingVPN: false,
            error: 'Failed to check VPN status. Please try again.'
        };
    }
} 