interface Window {
    turnstile?: {
        render: (container: string, options: {
            sitekey: string;
            theme?: 'light' | 'dark';
            callback: (token: string) => void;
        }) => void;
    };
    onloadTurnstileCallback?: () => void;
} 