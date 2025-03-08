'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { searchUsers, addFriend } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        const storedUserId = localStorage.getItem('user_id');
        if (!token) {
            router.push('/user/login');
        } else {
            setUserId(storedUserId);
        }
    }, [router]);

    useEffect(() => {
        if (searchTerm.length >= 3) {
            const fetchResults = async () => {
                try {
                    const data = await searchUsers(searchTerm);
                    setSearchResults(data);
                } catch (error) {
                    console.error('Error en la búsqueda:', error);
                }
            };

            fetchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleAddFriend = async (friendId) => {
        try {
            const result = await addFriend(friendId);
            alert(result.message);
            setSearchResults((prevResults) =>
                prevResults.map((user) =>
                    user.id === friendId ? { ...user, is_friend: true } : user
                )
            );
        } catch (error) {
            console.error('Error al agregar amigo:', error);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-[20px]">
                    Search <br /> User
                </h1>

                <div className="flex items-center justify-center space-x-4 mb-8">
                    <input type="text" placeholder="Search User" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md px-4 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-300" />
                    <button className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
                        <Image src="/qr.svg" width={25} height={25} alt="QR" className="filter  dark:filter-none" />
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-4">Resultados de la búsqueda:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col space-y-2">
                                            <span className="font-medium text-lg">{user.username}</span>
                                            <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                                        </div>
                                        {user.is_friend ? (
                                            <span className="text-green-500">✓ Ya son amigos</span>
                                        ) : (
                                            <button onClick={() => handleAddFriend(user.id)} className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition duration-300" >
                                                <Image src="/user-plus.svg" width={25} height={25} alt="Add User" className="filter dark:filter-none" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Menu />
        </div>
    );
}