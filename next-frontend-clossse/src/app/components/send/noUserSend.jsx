'use client';
import { useState } from 'react';

export default function NonUserForm() {
    const [btcAddress, setBtcAddress] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dirección BTC enviada:', btcAddress);
        setIsSubmitted(true);
    };

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <h2 className="text-2xl font-bold text-[#008080] dark:text-[#40E0D0] mb-4 text-center">
                Dirección ₿ a enviar
            </h2>
            {isSubmitted ? (
                <p className="text-center text-green-600 dark:text-green-400">
                    ¡Gracias! Hemos recibido tu dirección BTC.
                </p>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input type="text" value={btcAddress} onChange={(e) => setBtcAddress(e.target.value)} placeholder="Address Public"
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] dark:focus:ring-[#40E0D0]"
                        required
                    />
                    <button
                        type="submit"
                        className="px-8 py-3 bg-[#008080] hover:bg-[#006666] dark:bg-[#40E0D0] dark:hover:bg-[#30B0A0] text-white dark:text-gray-800 rounded-lg transition-colors duration-200 font-semibold"
                    >
                        Enviar
                    </button>
                </form>
            )}
        </div>
    );
}