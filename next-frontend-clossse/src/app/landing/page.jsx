'use client'
import React, { useState, useEffect } from 'react';
import { Bitcoin, Send, Shield, Lock } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen">
      <style jsx global>{`
        :root {
          --primary: #7FFFD4;
          --secondary: #008080;
          --tertiary: #40E0D0;
          --bg-primary: ${theme === 'light' ? '#ffffff' : '#1a1a1a'};
          --text-primary: ${theme === 'light' ? '#000000' : '#ffffff'};
        }
      `}</style>

      <nav className="bg-[var(--bg-primary)] py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <a href="#" className="flex items-center">
              <Bitcoin size={32} className="mr-2 text-[var(--primary)]" />
              <span className="text-[var(--text-primary)] text-xl font-bold">clossse</span>
            </a>
          </div>
        </div>
      </nav>

      <header className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Secure Anonymous Bitcoin Wallet</h1>
          <p className="text-xl mb-8">Store, send, and receive Bitcoin with complete privacy and security</p>
          <div className="flex justify-center gap-4">
            <button className="bg-[var(--primary)] text-[var(--text-primary)] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Get Started
            </button>
            <button className="bg-[var(--secondary)] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Learn More
            </button>
          </div>
        </div>
      </header>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 transform hover:-translate-y-2 transition-transform duration-300">
              <Shield size={48} className="text-[var(--primary)] mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Anonymous Transactions</h3>
              <p className="text-[var(--text-primary)]/80">Complete privacy for all your Bitcoin transactions. No KYC required.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 transform hover:-translate-y-2 transition-transform duration-300">
              <Lock size={48} className="text-[var(--primary)] mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Encrypted Storage</h3>
              <p className="text-[var(--text-primary)]/80">Your data is encrypted and stored securely. Only you have access to your funds.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 transform hover:-translate-y-2 transition-transform duration-300">
              <Send size={48} className="text-[var(--primary)] mb-6" />
              <h3 className="text-2xl font-semibold mb-4">Easy Transfers</h3>
              <p className="text-[var(--text-primary)]/80">Send and receive Bitcoin instantly with our user-friendly interface.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Bitcoin Wallet"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-8">Why Choose clossse?</h2>
              <ul className="space-y-4">
                <li className="flex items-center text-lg">
                  <span className="text-[var(--primary)] mr-3">✓</span>
                  Military-grade encryption
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-[var(--primary)] mr-3">✓</span>
                  No personal data required
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-[var(--primary)] mr-3">✓</span>
                  Instant transactions
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-[var(--primary)] mr-3">✓</span>
                  Secure key storage
                </li>
                <li className="flex items-center text-lg">
                  <span className="text-[var(--primary)] mr-3">✓</span>
                  24/7 support
                </li>
              </ul>
              <button className="mt-8 bg-[var(--primary)] text-[var(--text-primary)] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Create Wallet
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--secondary)] text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 clossse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;