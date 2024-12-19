import { ClerkProvider } from '@clerk/nextjs';
import '../../src/app/globals.css';
import NavBar from './components/NavBar'; // Adjust the path as needed

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen">
          <header>
            <NavBar />
          </header>
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
              <p className="text-sm">
                © {new Date().getFullYear()} <span className="font-semibold">TailTracker</span>. All rights reserved.
              </p>
              <div className="mt-2 flex justify-center space-x-4">
                {/* <a
                  href="https://www.example.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-200 text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="https://www.example.com/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-200 text-sm"
                >
                  Terms of Service
                </a> */}
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
