export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <div className="flex items-center">
                        <a href="/" className="text-white text-xl font-semibold">
                            Crumpet Media
                        </a>
                    </div>
                    <nav className="flex space-x-8">
                        <a
                            href="/whitepaper"
                            className="text-gray-300 hover:text-white transition-colors"
                        >
                            Whitepaper
                        </a>
                        <a
                            href="/crumbs"
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