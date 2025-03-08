'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { logout, getUserInfo } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        } else {
            fetchUserInfo();
        }
    }, [router]);

    const fetchUserInfo = async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            router.push('/user/login');
        }
    };

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

                {userInfo && (
                    <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Información del Usuario</h2>
                        <p><strong>Nombre:</strong> {userInfo.name}</p>
                        <p><strong>Apellidos:</strong> {userInfo.apellidos}</p>
                        <p><strong>Username:</strong> {userInfo.username}</p>
                        <p><strong>Email:</strong> {userInfo.email}</p>
                        <p><strong>Dirección Pública:</strong> {userInfo.public_address || 'No disponible'}</p>
                    </div>
                )}
            </div>

            <Menu />
        </div>
    );
}