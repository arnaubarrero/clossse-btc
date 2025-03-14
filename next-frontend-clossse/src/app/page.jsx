'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo } from './plugins/communicationManager';
import { Wallet, ArrowDown, ArrowUp, Clock, Copy } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const detectSystemTheme = () => {
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(isDarkMode ? 'dark' : 'light');
        };

        detectSystemTheme();

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleThemeChange = (e) => {
            setTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleThemeChange);
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
            const data = await getUserInfo(token);

            if (data && data.balance !== undefined) {
                setBalance(data.balance);

                const allTransactions = [
                    ...(data.receivedTransactions || []).map(tx => ({ ...tx, type: 'received' })),
                    ...(data.sentTransactions || []).map(tx => ({ ...tx, type: 'sent' })),
                    ...(data.pendingTransactions || []).map(tx => ({ ...tx, type: 'pending' })),
                ].sort((a, b) => new Date(a.date) - new Date(b.date));

                setTransactions(allTransactions);
            } else {
                throw new Error('Datos de usuario no válidos.');
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            setError(error.message);

            if (error.message.includes('autenticación') || error.message.includes('401')) {
                router.push('/user/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatAddress = (address) => {
        if (!address || address.length < 10) return address;
        return `${address.slice(0, 3)}...${address.slice(-7)}`;
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Dirección copiada al portapapeles');
        }).catch((err) => {
            console.error('Error al copiar la dirección:', err);
        });
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
                <p className={theme === 'light' ? 'text-[#008080]' : 'text-[#7FFFD4]'}>Cargando información...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'light' ? 'bg-white' : 'bg-black'}`}>
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-[#008080]' : 'bg-black text-[#7FFFD4]'} p-8`}>
            <div className="max-w-4xl mx-auto">
                <div className={`${theme === 'light' ? 'bg-[#f6faff]' : 'bg-gray-800'} p-6 rounded-lg shadow-md mb-8`}>
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <Wallet className="mr-2" /> Saldo total
                    </h2>
                    <p className="text-4xl font-bold">{balance.toFixed(8)} ₿</p>
                </div>

                <div className={`${theme === 'light' ? 'bg-[#f6faff]' : 'bg-gray-800'} p-6 rounded-lg shadow-md`}>
                    <h2 className="text-2xl font-semibold mb-4">Historial de transacciones</h2>
                    <ul>
                        {transactions.map((tx, index) => (
                            <li key={index} className={`mb-4 p-4 rounded-lg ${tx.type === 'received' ? 'bg-green-100 dark:bg-green-900' : tx.type === 'sent' ? 'bg-red-100 dark:bg-red-900' : 'bg-yellow-100 dark:bg-yellow-900' }`} >
                                <p><strong>Tipo:</strong> {tx.type === 'received' ? 'Recibida' : tx.type === 'sent' ? 'Enviada' : 'Pendiente'}</p>
                                <p><strong>Monto:</strong> {tx.amount.toFixed(8)} BTC</p>
                                <p className="flex items-center">
                                    <strong>Dirección:</strong> {formatAddress(tx.address)}
                                    <button onClick={() => copyToClipboard(tx.address)} className="ml-2 p-1 rounded hover:bg-opacity-20 hover:bg-gray-500" title="Copiar dirección" >
                                        <Copy size={16} />
                                    </button>
                                </p>
                                <p><strong>Confirmaciones:</strong> {tx.confirmations}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}