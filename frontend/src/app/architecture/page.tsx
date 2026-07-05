export default function ArchitecturePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 w-full">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-black mb-4">System Architecture</h2>
        <p className="text-gray-600 text-lg">A deep dive into how CoreTrade matches orders instantly.</p>
      </div>

      <div className="space-y-8">
        
        {/* The Engine Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <div className="bg-[#34e0a1]/20 p-2 rounded-full text-[#00aa6c]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            The Java Matching Engine
          </h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            The heart of this platform is a custom Java Spring Boot backend. Instead of relying on slow database queries to match buyers and sellers, the engine maintains in-memory Order Books.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By utilizing Java <strong className="text-black">Priority Queues</strong>, the engine can insert new orders in <code>O(log N)</code> time, and retrieve the best Bid or Ask in <code>O(1)</code> time. This strict Price/Time priority algorithm mimics the exact behavior of real-world exchanges like the NYSE.
          </p>
        </div>

        {/* The Database Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <div className="bg-[#34e0a1]/20 p-2 rounded-full text-[#00aa6c]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            Persistent State
          </h3>
          <p className="text-gray-700 leading-relaxed">
            While matching happens in-memory for speed, all transaction state is securely persisted to a cloud PostgreSQL cluster (Supabase) using <strong className="text-black">Hibernate/JPA</strong>. The connection utilizes a PgBouncer Transaction Pooler to handle rapid connection cycling without exhausting database resources.
          </p>
        </div>

        {/* The Frontend Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <div className="bg-[#34e0a1]/20 p-2 rounded-full text-[#00aa6c]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            Modern Frontend
          </h3>
          <p className="text-gray-700 leading-relaxed">
            The UI is built with <strong className="text-black">React and Next.js</strong>, deployed globally via Vercel. It continuously polls the Java backend REST APIs to provide users with a live, real-time view of market depth and recent transactions.
          </p>
        </div>

        {/* How to Use Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-black mb-4 flex items-center gap-3">
            <div className="bg-[#34e0a1]/20 p-2 rounded-full text-[#00aa6c]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
            </div>
            How to Use the Terminal
          </h3>
          
          <div className="space-y-4 text-gray-700">
            <p>
              To see the matching engine in action, head over to the <a href="/trade" className="text-[#00aa6c] font-bold hover:underline">Trade Terminal</a> page and follow these steps:
            </p>
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <strong>Look at the Order Book:</strong> Check the lowest <span className="text-red-600 font-bold">Ask (Sell)</span> price currently available on the market.
              </li>
              <li>
                <strong>Place a Matching Order:</strong> Go to the Place Order form, select <strong className="text-black">Buy</strong>, enter the exact same price as the lowest Ask (or higher), and set a quantity.
              </li>
              <li>
                <strong>Watch the Execution:</strong> Click "Buy" and watch as the Java backend instantly crosses the orders. You will see the matching quantities disappear from the Order Book, and a new transaction will instantly appear in the <strong>Recent Transactions</strong> feed!
              </li>
            </ol>
          </div>
        </div>

      </div>
    </main>
  );
}
