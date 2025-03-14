'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserInfo } from './plugins/communicationManager'

export default function Home() {
    const router = useRouter();
    const [wallet, setWallet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            // Verificar si la wallet está presente en la respuesta
            if (data && data.wallet !== undefined) {
                setWallet(data.wallet); // Actualizar el estado con la wallet
            } else {
                throw new Error('Datos de usuario no válidos.');
            }
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            setError(error.message);

            // Redirigir al login si hay un error de autenticación
            if (error.message.includes('autenticación') || error.message.includes('401')) {
                router.push('/user/login');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6faff] dark:bg-gray-900">
                <p className="text-gray-900 dark:text-white">Loading wallet...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f6faff] dark:bg-gray-900">
                <p className="text-red-500">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6faff] dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-4xl font-semibold mb-4">BTC Wallet</h2>
                <p className="text-5xl font-bold">{wallet ?? 'Loading...'}</p>
            </div>
        </div>
    );
}