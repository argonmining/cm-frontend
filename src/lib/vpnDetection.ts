interface VPNCheckResponse {
    success: boolean;
    error?: string;
    data?: {
        isUsingVPN: boolean;
        details?: {
            country: string;
            detectionType: string[];
        };
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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    if (!apiUrl) {
        console.error('API URL not configured');
        return { isUsingVPN: false, error: 'API not configured properly' };
    }

    try {
        const response = await fetch(`${apiUrl}/check-vpn`, {
            credentials: 'include', // Include cookies for session handling
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        let data: VPNCheckResponse;
        try {
            data = await response.json();
        } catch (jsonError) {
            console.error('Failed to parse VPN check response:', jsonError);
            return {
                isUsingVPN: false,
                error: 'Invalid response format from VPN service'
            };
        }

        // Handle rate limit errors specifically
        if (response.status === 429) {
            return {
                isUsingVPN: false,
                error: data?.error || 'Too many requests. Please try again in a few minutes.'
            };
        }

        // Handle other non-200 responses
        if (!response.ok) {
            return {
                isUsingVPN: false,
                error: data?.error || `VPN check failed: ${response.statusText}`
            };
        }
        
        if (!data.success) {
            return {
                isUsingVPN: false,
                error: data.error || 'VPN check failed'
            };
        }

        // If we don't have data, something went wrong
        if (!data.data) {
            return {
                isUsingVPN: false,
                error: 'Invalid response from VPN check service'
            };
        }

        // Validate the response data structure
        if (typeof data.data.isUsingVPN !== 'boolean') {
            console.error('Invalid isUsingVPN type in response:', data.data.isUsingVPN);
            return {
                isUsingVPN: false,
                error: 'Invalid response format from VPN service'
            };
        }

        return {
            isUsingVPN: data.data.isUsingVPN,
            details: data.data.details,
            // Even if no VPN is detected, we might want to show the country
            ...(data.data.details && { country: data.data.details.country })
        };
    } catch (error) {
        console.error('Error checking VPN status:', error);
        // Provide more specific error messages for common issues
        if (error instanceof TypeError && error.message.includes('NetworkError')) {
            return {
                isUsingVPN: false,
                error: 'Network error. Please check your internet connection.'
            };
        }
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            return {
                isUsingVPN: false,
                error: 'Could not connect to the VPN check service. Please try again.'
            };
        }
        return {
            isUsingVPN: false,
            error: error instanceof Error ? error.message : 'Failed to check VPN status. Please try again.'
        };
    }
} 