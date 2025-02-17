import { ClaimForm } from '@/components/ClaimForm';
import { Button } from '@/components/Button';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Top Section with Logo and Navigation */}
            <div className="relative w-full max-w-7xl mx-auto px-8 pt-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div>
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
                    <div className="flex flex-col space-y-4 pt-4">
                        <a
                            href="/docs/whitepaper.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="secondary" className="w-[175px]">
                                Whitepaper
                            </Button>
                        </a>
                        <a
                            href="https://kas.fyi/token/krc20/CRUMBS"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="secondary" className="w-[175px]">
                                $CRUMBS
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 px-4 pt-20 pb-48">
                <div className="max-w-4xl mx-auto">
                    <ClaimForm />
                </div>
            </div>
        </main>
    );
}
