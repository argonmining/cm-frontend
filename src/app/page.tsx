import { Header } from '@/components/Header';
import { ClaimForm } from '@/components/ClaimForm';
import Image from 'next/image';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Header />
            
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
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-silver/20 via-bright-teal/20 to-custom-teal/20 animate-gradient-x">
                    <div className="absolute inset-0 backdrop-blur-xl" />
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
