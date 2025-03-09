'use client';

import Swal from 'sweetalert2';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { getUserInfo } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [isFriend, setIsFriend] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

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

    const handleTransferBTC = (friendId) => {
        console.log(`Transferir BTC al amigo con ID: ${friendId}`);
    };

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 dark:from-gray-900 dark:to-gray-800 p-6 text-white">
            <h1 className="text-4xl font-extrabold mb-6 text-left drop-shadow-lg">Enviar BTC</h1>

            {isFriend === null ? (
                <>
                    <p className="mb-4 text-lg text-gray-200 text-left w-full max-w-xs">¿El destinatario es un amigo?</p>
                    <div className="flex flex-col h-[calc(80vh-8rem)] items-center justify-center">
                        <div className="flex flex-col space-y-4 w-full max-w-xs">
                            <button
                                onClick={() => handleFriendSelection(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:scale-110 w-full"
                            >
                                Sí
                            </button>
                            <button
                                onClick={() => handleFriendSelection(false)}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl shadow-md transition transform hover:scale-110 w-full"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </>
            ) : isFriend ? (
                <div className="flex flex-col items-center justify-center">
                    <p className="mb-4 text-lg text-gray-200 text-left w-full max-w-xs">
                        Selecciona un amigo para transferir BTC:
                    </p>
                    {userInfo && userInfo.friends && userInfo.friends.length > 0 ? (
                        <div className="w-full max-w-xs">
                            {userInfo.friends.map((friend) => (
                                <div key={friend.id} className="flex justify-between items-center mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
                                    <div>
                                        <p className="text-gray-700 dark:text-gray-400">Name: {friend.name}</p>
                                        <p className="text-gray-900 dark:text-gray-200 font-semibold">Username: {friend.username}</p>
                                        <p className="text-gray-700 dark:text-gray-400">{friend.email}</p>
                                        <p className="text-gray-700 dark:text-gray-400 flex items-center">
                                            {formatPublicAddress(friend.public_address)}
                                            <button
                                                onClick={() => showFullAddress(friend.public_address)}
                                                className="ml-2 text-blue-400 hover:text-blue-300"
                                            >
                                                <Image src="/eye.svg" width={25} height={25} alt="Eye" className="filter invert dark:filter-none" />
                                            </button>
                                        </p>
                                        <button
                                            onClick={() => handleTransferBTC(friend.id)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl shadow-md transition transform hover:scale-110"
                                        >
                                            Transferir BTC
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
                <div className="flex flex-col h-[calc(80vh-8rem)] items-center justify-center">
                    <p className="mb-4 text-lg text-gray-200 text-left w-full max-w-xs">
                        El destinatario no es un amigo.
                    </p>
                </div>
            )}
            <Menu />
        </div>
    );

}