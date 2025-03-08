'use client';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { logout, getUserInfo } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [friends, setFriends] = useState([
        { id: 1, name: 'Juan Pérez', username: 'juanperez', email: 'juan@example.com' },
        { id: 2, name: 'María Gómez', username: 'mariagomez', email: 'maria@example.com' },
        { id: 3, name: 'Carlos López', username: 'carloslopez', email: 'carlos@example.com' },
    ]);

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

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Copiado',
                text: 'La dirección pública ha sido copiada al portapapeles.',
                confirmButtonColor: '#2563EB',
            });
        }).catch((err) => {
            console.error('Error al copiar al portapapeles:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo copiar la dirección pública.',
                confirmButtonColor: '#2563EB',
            });
        });
    };

    const showFullAddress = (address) => {
        Swal.fire({
            title: 'Dirección Pública Completa',
            text: address,
            confirmButtonColor: '#2563EB',
        });
    };

    const formatAddress = (address) => {
        if (!address) return 'No disponible';
        return `${address.slice(0, 5)}...${address.slice(-8)}`;
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
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} transition-colors duration-300`}>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Personal <br /> Menu
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                    >
                        <span>Log Out</span>
                        <Image src="/logout.svg" width={25} height={25} alt="Logout" className="filter dark:filter-none" />
                    </button>
                </div>

                <div>
                    {userInfo && (
                        <section className={`p-8 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                <span>User Information</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                                        <p className="font-medium">{`${userInfo.name} ${userInfo.apellidos}`}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                                        <p className="font-medium">@{userInfo.username}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                                        <p className="font-medium">{userInfo.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Public Address</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono text-sm">
                                                {formatAddress(userInfo.public_address)}
                                            </code>
                                            <button
                                                onClick={() => copyToClipboard(userInfo.public_address)}
                                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="Copy address"
                                            >
                                                <Image src="/copy.svg" width={25} height={25} alt="Copy" className="filter dark:filter-none" />
                                            </button>
                                            <button
                                                onClick={() => showFullAddress(userInfo.public_address)}
                                                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                title="View full address"
                                            >
                                                <Image src="/eye.svg" width={25} height={25} alt="Eye" className="filter dark:filter-none" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <div className={`mt-8 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-md`}>
                        <h2 className="text-2xl font-semibold mb-4">Listado de Amigos</h2>
                        <div className="space-y-4">
                            {friends.map((friend) => (
                                <div key={friend.id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
                                    <div className="flex items-center justify-between">
                                        <p><strong>Nombre:</strong> {friend.name}</p>
                                        <div className="flex justify-center items-center w-10 h-10">
                                            <Image src="/btc.svg" width={25} height={25} alt="Btc" className="filter dark:filter-none" />
                                        </div>
                                    </div>
                                    <p><strong>Username:</strong> {friend.username}</p>
                                    <p><strong>Email:</strong> {friend.email}</p>
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