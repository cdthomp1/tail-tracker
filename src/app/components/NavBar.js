import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function NavBar() {
    return (
        <nav className="bg-gray-800 text-white px-4 py-3">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left-Aligned Brand Name */}
                <div className="text-2xl font-bold">
                    <Link href="/">TailTracker</Link>
                </div>

                {/* Right-Aligned Links and Authentication Buttons */}
                <div className="flex items-center space-x-6">
                    {/* Navigation Links */}
                    <Link href="/" className="hover:text-gray-300">
                        Home
                    </Link>
                    <Link href="/entries" className="hover:text-gray-300">
                        Entries
                    </Link>

                    {/* Authentication Buttons */}
                    <SignedOut>
                        <SignInButton>
                            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
