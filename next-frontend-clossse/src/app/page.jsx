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
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'received': return <ArrowDownCircle className="w-6 h-6 text-green-600" />;
            case 'sent': return <ArrowUpCircle className="w-6 h-6 text-red-600" />;
            case 'pending': return <Clock className="w-6 h-6 text-yellow-600" />;
            default: return <Bitcoin className="w-6 h-6 text-blue-500" />;
        }
    };

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
                throw new Error('Invalid user data.');
            }

            setBalance(data.balance);

            const allTransactions = [
                ...(data.receivedTransactions || []).map(tx => ({ ...tx, type: 'received' })),
                ...(data.sentTransactions || []).map(tx => ({ ...tx, type: 'sent' })),
                ...(data.pendingTransactions || []).map(tx => ({ ...tx, type: 'pending' })),
            ].sort((a, b) => new Date(b.timereceived || b.time) - new Date(a.timereceived || a.time));

            setTransactions(allTransactions);
        } catch (error) {
            console.error('Error fetching user information:', error);
            setError(error.message);

            if (error.message.includes('authentication') || error.message.includes('401')) {
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
            alert('Address copied to clipboard');
        }).catch((err) => {
            console.error('Error copying address:', err);
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-blue-600">Loading information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen animated-blue-gradient text-blue-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Balance Section */}
                <div className="h-[20vh] flex flex-col justify-center p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-3 text-blue-800">
                            <span>Total Balance</span>
                        </h2>
                    </div>
                    <p className="text-5xl font-bold tracking-tight flex items-center gap-2 text-blue-900">
                        {Number(balance).toFixed(8)}
                        <span className="text-3xl opacity-75">₿</span>
                    </p>
                </div>

                {/* Transactions Section */}
                <div className='h-[50vh] mt-1.5 relative'>
                    <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4 text-blue-800">
                        <Building2 className="w-8 h-8 text-blue-600" />
                        <span>Transaction History</span>
                    </h2>

                    <div className="bg-white shadow-lg h-[calc(100%-4rem)] w-full overflow-y-auto rounded-2xl">
                        <div className="space-y-4 p-4">
                            {transactions.map((tx, index) => (
                                <div key={index} className={`p-4 transition-all duration-300 rounded-xl ${tx.type === 'received' ? 'bg-blue-100' : tx.type === 'sent' ? 'bg-blue-50' : 'bg-yellow-50'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            {getTransactionIcon(tx.type)}
                                        </div>
                                        <span className={`text-xl font-bold flex items-center gap-1 ${tx.type === 'received' ? 'text-green-600' : tx.type === 'sent' ? 'text-red-600' : 'text-yellow-600'}`}>
                                            {tx.type === 'sent' ? '' : '+'}{Number(tx.amount).toFixed(8)}
                                            <Bitcoin className="w-5 h-5 opacity-75" />
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-sm text-blue-800">
                                        <div className="flex items-center justify-between">
                                            <span>Address</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono">{formatAddress(tx.address)}</span>
                                                <button onClick={() => copyToClipboard(tx.address)} className="p-1.5 hover:bg-blue-100 rounded-full" title="Copy address">
                                                    <Copy size={14} className="text-blue-600" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span>Confirmations</span>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle2 className={`w-4 h-4 ${tx.confirmations === 0 ? 'text-yellow-600' : 'text-green-600'}`} />
                                                <span className={`font-medium ${tx.confirmations === 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                                                    {tx.confirmations === 0 ? 'Pending' : tx.confirmations}
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