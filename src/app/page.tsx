import { ClaimForm } from '@/components/ClaimForm';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                {/* Dark Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
                
                {/* Vertical Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

                {/* Large Logo */}
                <div className="absolute top-8 left-8 z-20">
                    <Image
                        src="/images/crumpet-logo.png"
                        alt="Crumpet Logo"
                        width={200}
                        height={200}
                        priority
                        className="w-[200px] h-[200px]"
                    />
                </div>

                {/* Navigation Links */}
                <div className="absolute top-4 right-4 z-20 flex space-x-8">
                    <a
                        href="/docs/whitepaper.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        Whitepaper
                    </a>
                    <a
                        href="https://kas.fyi/token/krc20/CRUMBS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        $CRUMBS
                    </a>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-20 -mt-20 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <ClaimForm />
                </div>
            </div>
        </main>
    );
}
