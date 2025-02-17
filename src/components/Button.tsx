import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'primary' | 'secondary';
}

export function Button({
    children,
    className,
    isLoading = false,
    variant = 'primary',
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={clsx(
                'w-full px-4 py-3 rounded-lg font-medium transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
                {
                    'bg-gradient-to-r from-silver via-bright-teal to-custom-teal text-white border-transparent hover:from-silver/80 hover:via-bright-teal hover:to-custom-teal focus:ring-bright-teal':
                        variant === 'primary',
                    'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20 focus:ring-gray-500':
                        variant === 'secondary',
                },
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-75" />
                </div>
            ) : (
                children
            )}
        </button>
    );
} 