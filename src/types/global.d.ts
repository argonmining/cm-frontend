declare global {
    interface Window {
        turnstile?: {
            render: (container: string, options: {
                sitekey: string;
                theme?: 'light' | 'dark';
                callback: () => void;
            }) => void;
        };
        onloadTurnstileCallback?: () => void;
    }
}

export {}; 