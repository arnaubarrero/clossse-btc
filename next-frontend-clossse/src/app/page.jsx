'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from './components/menu/menu';
import { getUserInfo } from './plugins/communicationManager';
import { Wallet, Copy, ArrowDownCircle, ArrowUpCircle, Clock, CheckCircle2, Bitcoin, Building2 } from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const [error, setError] = useState(null);
    const [balance, setBalance] = useState(0);
    const [theme, setTheme] = useState('light');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'received': return <ArrowDownCircle className="w-6 h-6 text-green-600 dark:text-green-400" />;
            case 'sent': return <ArrowUpCircle className="w-6 h-6 text-red-600 dark:text-red-400" />;
            case 'pending': return <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
            default: return <Bitcoin className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
        }
    };

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

            if (!data || data.balance === undefined) {
                throw new Error('Datos de usuario no válidos.');
            }

            setBalance(data.balance);

            const allTransactions = [
                ...(data.receivedTransactions || []).map(tx => ({ ...tx, type: 'received' })),
                ...(data.sentTransactions || []).map(tx => ({ ...tx, type: 'sent' })),
                ...(data.pendingTransactions || []).map(tx => ({ ...tx, type: 'pending' })),
            ].sort((a, b) => new Date(b.timereceived || b.time) - new Date(a.timereceived || a.time));

            setTransactions(allTransactions);
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
        <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-white to-blue-50 text-[#008080]' : 'bg-gradient-to-br from-gray-900 to-black text-[#7FFFD4]'
            } p-8`}>
            <div className="max-w-4xl mx-auto space-y-8">

                <div className={`${theme === 'light' ? 'text-[#008080]' : 'text-[#7FFFD4]'} h-[20vh] flex flex-col justify-center p-8`}>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-3">
                            <Wallet className="w-8 h-8" />
                            <span>Saldo total</span>
                        </h2>
                    </div>
                    <p className="text-5xl font-bold tracking-tight flex items-center gap-2">
                        {Number(balance).toFixed(8)}
                        <span className="text-3xl opacity-75">₿</span>
                    </p>
                </div>

                <div className='h-[50vh] relative'>
                    <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4">
                        <Building2 className="w-8 h-8" />
                        <span>Historial de transacciones</span>
                    </h2>

                    <div className={`${theme === 'light' ? 'bg-white shadow-md' : 'bg-gray-900 shadow-md'} h-[calc(100%-4rem)] w-full overflow-y-auto rounded-3xl`}>
                        <div className="space-y-4">
                            {transactions.map((tx, index) => (
                                <div key={index} className={`p-3 transition-all duration-300 hover:transform hover:scale-[1.02] ${tx.type === 'received' ? 'bg-green-50 dark:bg-green-900/30' : tx.type === 'sent' ? 'bg-red-50 dark:bg-red-900/30' : 'bg-yellow-50 dark:bg-yellow-900/30' }`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            {getTransactionIcon(tx.type)}
                                        </div>
                                        <span className="text-xl font-bold flex items-center gap-1">
                                            {tx.type === 'sent' ? '' : '+'}{Number(tx.amount).toFixed(8)}
                                            <Bitcoin className="w-5 h-5 opacity-75" />
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Dirección</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono">{formatAddress(tx.address)}</span>
                                                <button onClick={() => copyToClipboard(tx.address)} className="p-1.5 " title="Copiar dirección" >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">Confirmaciones</span>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className={`w-4 h-4 ${tx.confirmations === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400' }`} />
                                                <span className={`font-medium ${tx.confirmations === 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400' }`}>
                                                    {tx.confirmations === 0 ? 'Pending to receive' : tx.confirmations}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Menu />
        </div>
    );
}