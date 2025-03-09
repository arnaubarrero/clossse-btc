'use client';

import Swal from 'sweetalert2';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { getUserInfo, searchUsers } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [isFriend, setIsFriend] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const formatPublicAddress = (address) => {
        if (!address) return '';
        const firstFive = address.slice(0, 5);
        const lastEight = address.slice(-8);
        return `${firstFive}...${lastEight}`;
    };

    const showFullAddress = (address) => {
        Swal.fire({
            title: 'Dirección completa',
            text: address,
            icon: 'info',
            confirmButtonText: 'Cerrar',
        });
    };

    const handleFriendSelection = async (isFriend) => {
        if (isFriend) {
            setIsFriend(true);
            try {
                const info = await getUserInfo();
                setUserInfo(info);
            } catch (error) {
                console.error('Error al obtener la información del usuario:', error);
            }
        } else {
            setIsFriend(false);
        }
    };

    const handleTransferBTC = (userId) => {
        router.push(`/user/send/${userId}`);
    };

    const handleSearch = async () => {
        try {
            const results = await searchUsers(searchQuery);
            setSearchResults(results);
        } catch (error) {
            console.error('Error al buscar usuarios:', error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo realizar la búsqueda',
                icon: 'error',
                confirmButtonText: 'Cerrar',
            });
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br dark:from-gray-900 dark:to-gray-800 p-6 text-white">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> Send <br /> Bitcoin </h1>

            {isFriend === null ? (
                <>
                    <p className="mb-4 text-lg text-gray-900 dark:text-gray-50 text-left w-full max-w-xs">Is the recipient a friend?</p>
                    <div className="flex flex-col h-[calc(80vh-8rem)] items-center justify-center">
                        <div className="flex flex-col space-y-4 w-full max-w-xs">
                            <button onClick={() => handleFriendSelection(true)} className="bg-blue-500 text-white px-6 py-3 shadow-md transition transform w-full" >
                                Sí
                            </button>
                            <button onClick={() => handleFriendSelection(false)} className="bg-purple-500 text-white px-6 py-3 shadow-md transition transform w-full" >
                                No
                            </button>
                        </div>
                    </div>
                </>
            ) : isFriend ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="mb-4 text-lg text-gray-200 text-left w-full max-w-xs">
                        Select a friend to transfer BTC:
                    </p>
                    {userInfo && userInfo.friends && userInfo.friends.length > 0 ? (
                        <div className="w-[100%]">
                            {userInfo.friends.map((friend) => (
                                <div key={friend.id} className="flex justify-between items-center mb-4 p-4 bg-gray-100 dark:bg-gray-800">
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-400">Name: {friend.name}</p>
                                        <p className="text-gray-900 dark:text-gray-200 font-semibold">Username: {friend.username}</p>
                                        <p className="text-gray-700 dark:text-gray-400">{friend.email}</p>
                                        <p className="text-gray-700 dark:text-gray-400 flex items-center">
                                            {formatPublicAddress(friend.public_address)}
                                            <button onClick={() => showFullAddress(friend.public_address)} className="ml-2 text-blue-400 hover:text-blue-300" >
                                                <Image src="/eye.svg" width={25} height={25} alt="Eye" className="filter invert dark:filter-none" />
                                            </button>
                                        </p>
                                        <button onClick={() => handleTransferBTC(friend.id)} className="bg-gradient-to-r from-blue-500 to-purple-600 mt-[20px] text-white px-4 py-1" >
                                            Transfer Bitcoin
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-200">No tienes amigos registrados.</p>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <p className="mb-4 text-lg text-gray-200 text-left w-full max-w-xs">
                        Busca un usuario para transferir BTC:
                    </p>
                    <div className="flex flex-col space-y-4 w-full max-w-xs">
                        <input type="text" placeholder="Buscar usuario..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-gray-100 dark:bg-gray-800 outline-0 text-gray-900 dark:text-gray-200 px-4 py-2" />
                        <button onClick={handleSearch} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 w-full" >
                            Buscar
                        </button>
                    </div>
                    {searchResults.length > 0 && (
                        <div className="w-full max-w-xs mt-4">
                            {searchResults.map((user) => (
                                <div key={user.id} className="flex justify-between items-center mb-4 p-4 bg-gray-100 dark:bg-gray-800">
                                    <div className='w-[100%]'>
                                        <p className="text-gray-900 dark:text-gray-200 font-semibold">Username: {user.username}</p>
                                        <p className="text-gray-700 dark:text-gray-400">{user.email}</p>
                                        <p className="text-gray-700 dark:text-gray-400 flex items-center">
                                            {formatPublicAddress(user.public_address)}
                                            <button onClick={() => showFullAddress(user.public_address)} className="ml-2 text-blue-400 hover:text-blue-300" >
                                                <Image src="/eye.svg" width={25} height={25} alt="Eye" className="filter invert dark:filter-none" />
                                            </button>
                                        </p>
                                        <button onClick={() => handleTransferBTC(user.id)} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 mt-[20px]" >
                                            Transferir BTC
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <Menu />
        </div>
    );
}