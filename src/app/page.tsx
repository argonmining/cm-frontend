import { Header } from '@/components/Header';
import { ClaimForm } from '@/components/ClaimForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Header />
            
            {/* Hero Section with Image Space */}
            <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />
                {/* Placeholder for image/animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-silver/20 via-bright-teal/20 to-custom-teal/20 animate-gradient-x">
                    <div className="absolute inset-0 backdrop-blur-3xl" />
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
