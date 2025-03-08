'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from './components/menu/menu';
import { getUserInfo } from './plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [btcBalance, setBtcBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleDarkModeChange = (e) => {
            setIsDarkMode(e.matches);
        };

        setIsDarkMode(darkModeMediaQuery.matches);
        darkModeMediaQuery.addEventListener('change', handleDarkModeChange);

        return () => {
            darkModeMediaQuery.removeEventListener('change', handleDarkModeChange);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        } else {
            fetchUserInfo(token);
        }
    }, [router]);

    const fetchUserInfo = async (token) => {
        try {
            const data = await getUserInfo();
            setUserInfo(data.user);
            if (data.user.public_address) {
                await fetchBtcBalance(data.user.public_address);
                await fetchTransactions(data.user.public_address);
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            setError(error.message);
            router.push('/user/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchBtcBalance = async (publicAddress) => {
        try {
            const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${publicAddress}/balance`);
            if (!response.ok) {
                throw new Error('Error al obtener el saldo de BTC');
            }
            const data = await response.json();
            const balanceBTC = (data.balance / 100000000).toFixed(5); // Convertir de satoshis a BTC
            setBtcBalance(balanceBTC);
        } catch (error) {
            console.error('Error al obtener el saldo de BTC:', error);
            setBtcBalance('Error');
        }
    };

    const fetchTransactions = async (publicAddress) => {
        try {
            const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${publicAddress}/full`);
            if (!response.ok) {
                throw new Error('Error al obtener el historial de transacciones');
            }
            const data = await response.json();
            // Agregar lógica para determinar si la transacción fue enviada o recibida
            const processedTransactions = data.txs.map((tx) => {
                const isSent = tx.inputs.some((input) => input.addresses.includes(publicAddress));
                return {
                    ...tx,
                    type: isSent ? 'Sent' : 'Received',
                };
            });
            setTransactions(processedTransactions);
        } catch (error) {
            console.error('Error al obtener el historial de transacciones:', error);
            setTransactions([]);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-900 dark:text-white">Loading user information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
                    Welcome, {userInfo ? `${userInfo.name}` : 'User'}
                </h1>

                {userInfo && (
                    <>
                        <div className="mb-8 p-6 text-center">
                            <h2 className="text-2xl font-semibold mb-4">BTC Balance</h2>
                            <div className="text-center">
                                <p className="text-3xl font-bold">{btcBalance ?? 'Loading...'} ₿</p>
                            </div>
                        </div>

                        <section className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Type</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Amount (BTC)</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-sm font-semibold ${tx.type === 'Sent'
                                                                ? 'bg-red-100 text-red-600 dark:bg-red-600 dark:text-red-100'
                                                                : 'bg-green-100 text-green-600 dark:bg-green-600 dark:text-green-100'
                                                            }`}
                                                    >
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">{(tx.total / 100000000).toFixed(5)}</td>
                                                <td className="px-6 py-4">{new Date(tx.received).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}
                <Menu />
            </div>
        </div>
    );
}