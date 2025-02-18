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
    try {
        const response = await fetch('/api/check-vpn');
        
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

        return {
            isUsingVPN: data.data.isUsingVPN,
            details: data.data.details
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