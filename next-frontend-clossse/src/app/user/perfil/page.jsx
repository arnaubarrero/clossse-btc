'use client';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { logout } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/user/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
            <div className="container mx-auto p-4">
                <div className="justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-500">Menu Personal</h1>
                    <button onClick={handleLogout}
                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300" >
                        <span>Log Out</span>
                        <Image src="/logout.svg" width={25} height={25} alt="Logout" className="filter dark:filter-none" />
                    </button>
                </div>
            </div>

            <Menu />
        </div>
    );
}