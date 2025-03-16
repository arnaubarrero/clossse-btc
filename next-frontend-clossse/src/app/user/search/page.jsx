'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { searchUsers, addFriend } from '../../plugins/communicationManager';
import { Search, UserPlus, UserCheck, QrCode } from 'lucide-react'; // Iconos de Lucide

export default function Home() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [userId, setUserId] = useState(null);
    const [isSearching, setIsSearching] = useState(false); // Estado para controlar la búsqueda

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        const storedUserId = localStorage.getItem('user_id');
        if (!token) {
            router.push('/user/login');
        } else {
            setUserId(storedUserId);
        }
    }, [router]);

    const handleSearch = async () => {
        if (searchTerm.length >= 3) {
            setIsSearching(true);
            try {
                const data = await searchUsers(searchTerm);
                setSearchResults(data);
            } catch (error) {
                console.error('Error searching users:', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddFriend = async (friendId) => {
        try {
            const result = await addFriend(friendId);
            setSearchResults((prevResults) =>
                prevResults.map((user) =>
                    user.id === friendId ? { ...user, is_friend: true } : user
                )
            );
        } catch (error) {
            console.error('Error adding friend:', error);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen animated-blue-gradient text-blue-900">
            <div className="container mx-auto p-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800  bg-clip-text text-transparent mb-6">
                    Search <br /> Users
                </h1>

                <div className="flex items-center justify-center space-x-4 mb-8">
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={isSearching || searchTerm.length < 3}
                        className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-blue-300"
                    >
                        <Search size={24} className="text-white" />
                    </button>
                    <button
                        onClick={() => alert('QR functionality not implemented yet')} // Placeholder para la funcionalidad QR
                        className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        <QrCode size={24} className="text-white" />
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-4">Search Results:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col space-y-2">
                                            <span className="font-medium text-lg">{user.username}</span>
                                            <span className="text-gray-600">{user.email}</span>
                                        </div>
                                        {user.is_friend ? (
                                            <span className="text-green-500">
                                                <UserCheck size={24} />
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleAddFriend(user.id)}
                                                className="p-2 bg-green-500 rounded-lg hover:bg-green-600 transition duration-300"
                                            >
                                                <UserPlus size={24} className="text-white" />
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