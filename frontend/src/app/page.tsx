import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex-1 bg-white">
      {/* Hero Section */}
      <section className="bg-[#f2f2f2] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-black tracking-tight mb-6">
            High-Performance <br />
            <span className="text-[#00aa6c]">Order Matching.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience real-time, low-latency financial trading powered by a custom Java Spring Boot matching engine and Priority Queue data structures.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/trade" 
              className="bg-[#00aa6c] hover:bg-[#008c59] text-white font-bold text-lg px-8 py-4 rounded-full transition-transform transform hover:scale-105 w-full sm:w-auto shadow-lg"
            >
              Launch Trading Terminal
            </Link>
            <Link 
              href="/architecture" 
              className="bg-white hover:bg-gray-50 text-black border-2 border-black font-bold text-lg px-8 py-4 rounded-full transition-colors w-full sm:w-auto"
            >
              Read the Architecture
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
