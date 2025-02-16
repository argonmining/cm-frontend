import { Header } from '@/components/Header';
import { ClaimForm } from '@/components/ClaimForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
            <Header />
            <div className="pt-32 pb-12 px-4">
                <ClaimForm />
            </div>
        </main>
    );
}
