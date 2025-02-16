export interface Claim {
    id: number;
    wallet_address: string;
    amount: string;
    status: 'processing' | 'completed' | 'failed';
    transaction_hash?: string;
    transaction_error?: string;
    created_at: Date;
    updated_at: Date;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
} 