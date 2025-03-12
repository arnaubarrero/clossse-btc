'use client';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { logout, getUserInfo, updateUsername } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);

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
            setUserInfo(data.user);
            setFriends(data.friends);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
            setError(error.message);
            router.push('/user/login');
        } finally {
            setLoading(false);
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
            localStorage.removeItem('Login Token');
            localStorage.removeItem('PINVerified');
            router.push('/user/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleUpdateUsername = async () => {
        try {
            const data = await updateUsername(newUsername);

            setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                username: newUsername,
            }));

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Nombre de usuario actualizado correctamente',
                confirmButtonColor: '#2563EB',
            });

            setNewUsername('');
            setIsEditingUsername(false);
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message,
                confirmButtonColor: '#2563EB',
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Cargando información del usuario...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} transition-colors duration-300`}>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Personal <br /> Menu
                    </h1>
                    <button onClick={handleLogout} className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                        <span>Log Out</span>
                        <Image src="/logout.svg" width={25} height={25} alt="Logout" className="filter dark:filter-none" />
                    </button>
                </div>

                <div>
                    {userInfo && (
                        <section className={`p-8 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Full Name</label>
                                        <p className="font-medium">{`${userInfo.name} ${userInfo.apellidos}`}</p>
                                    </div>
                                    <label className="text-sm text-gray-500 dark:text-gray-400">Username</label>
                                    <div className='flex flex-col'>
                                        <div className='flex items-center'>
                                            <p className="font-medium">@{userInfo.username}</p>
                                            {!isEditingUsername ? (
                                                <button onClick={() => setIsEditingUsername(true)}>
                                                    <Image src="/pen.svg" width={25} height={25} alt="Pen" className="filter dark:filter-none ml-[10px]" />
                                                </button>
                                            ) : null}
                                        </div>
                                        {isEditingUsername && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={newUsername}
                                                    onChange={(e) => setNewUsername(e.target.value)}
                                                    placeholder="New username"
                                                    className="p-2 border border-gray-300 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                                />
                                                <button onClick={handleUpdateUsername} className="p-2 rounded-lg focus:outline-none focus:ring-2 text-green-600" >
                                                    ✔
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingUsername(false)}
                                                    className="p-2 rounded-lg focus:outline-none focus:ring-2 text-red-600"
                                                >
                                                    X
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-500 dark:text-gray-400">Email</label>
                                        <p className="font-medium">{userInfo.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg font-mono text-sm">
                                            {formatAddress(userInfo.public_address)}
                                        </code>
                                        <button onClick={() => copyToClipboard(userInfo.public_address)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200" title="Copy address" >
                                            <Image src="/copy.svg" width={25} height={25} alt="Copy" className="filter dark:filter-none" />
                                        </button>
                                        <button onClick={() => showFullAddress(userInfo.public_address)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200" title="View full address" >
                                            <Image src="/eye.svg" width={25} height={25} alt="Eye" className="filter dark:filter-none" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <div className={`mt-8 p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow-md`}>
                        <h2 className="text-2xl font-semibold mb-4">Listado de Amigos</h2>
                        <div className="space-y-4">
                            {friends.length > 0 ? (
                                friends.map((friend) => (
                                    <div key={friend.id} className={`p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}>
                                        <div className="flex items-center justify-between">
                                            <p><strong>Nombre:</strong> {friend.name}</p>
                                            <div className="flex justify-center items-center w-10 h-10">
                                                <Image src="/btc.svg" width={25} height={25} alt="Btc" className="filter invert dark:filter-none" />
                                            </div>
                                        </div>
                                        <p><strong>Username:</strong> {friend.username}</p>
                                        <p><strong>Email:</strong> {friend.email}</p>
                                        <p><strong>Llave Pública:</strong> {formatAddress(friend.public_address)}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No tienes amigos agregados.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Menu />
        </div>
    );
}