'use client';

import { SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 flex flex-col items-center py-10 px-4 sm:px-8">
      {/* Header Section */}
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4">
          Welcome to TailTracker
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Your personal airplane journal to track flights, log experiences, and explore aviation history.
        </p>
      </header>

      {/* Features Section */}
      <section className="w-full max-w-4xl text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          What is TailTracker?
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-6">
          TailTracker is an app designed for aviation enthusiasts and professionals to:
        </p>
        <ul className="text-left bg-white rounded-lg shadow-md p-6 space-y-4">
          <li className="flex items-start">
            <span className="text-blue-600 text-xl font-bold mr-3">✓</span>
            Track airplanes you've flown on or spotted.
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 text-xl font-bold mr-3">✓</span>
            Log flight details, including dates, routes, and more.
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 text-xl font-bold mr-3">✓</span>
            Explore detailed information about aircraft registrations.
          </li>
        </ul>
      </section>

      {/* Call-to-Action Section */}
      <section className="w-full max-w-2xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Get Started Today
        </h2>
        <p className="text-gray-600 text-base md:text-lg mb-6">
          Sign in to start logging your flights and exploring the skies.
        </p>
        <SignedOut>
          <SignInButton>
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <p className="text-green-600 text-lg">You're signed in! Navigate to Entries to get started.</p>
        </SignedIn>
      </section>
    </div>
  );
}
