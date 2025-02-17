import { ClaimForm } from '@/components/ClaimForm';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Hero Section with Background Image */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/images/hero-background.png"
                        alt="Hero background"
                        fill
                        priority
                        className="object-cover object-center"
                        quality={100}
                    />
                </div>
                
                {/* Single Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />

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
