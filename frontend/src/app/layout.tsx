import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoreTrade Engine",
  description: "High-Performance Java Order Matching Engine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#f2f2f2]`}
    >
      <body className="min-h-full flex flex-col font-sans text-gray-900">
        
        {/* Global TripAdvisor Style Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              
              {/* Logo / Home Link */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="bg-[#34e0a1] w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-black tracking-tight group-hover:text-[#00aa6c] transition-colors">CoreTrade</h1>
              </Link>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 border-l pl-6 border-gray-200">
                <Link href="/" className="text-sm font-bold text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">Home</Link>
                <Link href="/trade" className="text-sm font-bold text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">Trade Terminal</Link>
                <Link href="/architecture" className="text-sm font-bold text-gray-700 hover:text-black hover:bg-gray-100 px-4 py-2 rounded-full transition-colors">Architecture</Link>
              </nav>

            </div>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/Saksham-Gupta-GH/core-trade-engine" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-semibold text-black hover:bg-gray-100 px-4 py-2 rounded-full transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            </div>
          </div>
        </header>

        {children}
        
      </body>
    </html>
  );
}
