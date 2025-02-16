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
                'w-full px-4 py-3 rounded-lg font-medium transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                {
                    'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
                    'bg-gray-200 text-gray-800 hover:bg-gray-300': variant === 'secondary',
                },
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                children
            )}
        </button>
    );
} 