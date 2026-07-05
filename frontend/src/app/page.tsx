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

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#34e0a1]/20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00aa6c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Instant Execution</h3>
              <p className="text-gray-600 leading-relaxed">
                Orders are matched instantly using O(1) in-memory Priority Queues built in Java, eliminating database bottlenecks during live trading.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#34e0a1]/20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00aa6c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Enterprise Grade</h3>
              <p className="text-gray-600 leading-relaxed">
                Powered by a robust Spring Boot REST API and Hibernate JPA, following strict OOP principles and strict Price/Time matching priority.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#34e0a1]/20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#00aa6c]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">Persistent State</h3>
              <p className="text-gray-600 leading-relaxed">
                Transaction history and open orders are securely stored in a cloud PostgreSQL cluster, ensuring no data loss across server restarts.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
