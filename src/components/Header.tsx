import Link from 'next/link';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <Link href="/" className="text-white text-xl font-semibold">
                            Crumpet Media
                        </Link>
                    </div>
                    <nav className="flex space-x-8">
                        <a
                            href="/docs/whitepaper.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Whitepaper
                        </a>
                        <a
                            href="https://kas.fyi/token/krc20/CRUMBS"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            $CRUMBS
                        </a>
                    </nav>
                </div>
            </div>
        </header>
    );
} 