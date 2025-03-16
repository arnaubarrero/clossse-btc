"use client";
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFriendsList } from '../../plugins/communicationManager';

const FriendTrue = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const formatPublicAddress = (address) => {
        if (!address || address.length < 8) {
            return address || 'Not available';
        }
        const firstThree = address.slice(0, 3);
        const lastFive = address.slice(-5);
        return `${firstThree}...${lastFive}`;
    };

    const handleSend = (userId) => {
        router.push(`/user/send/${userId}`);
    };

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const data = await getFriendsList();
                setFriends(data);
            } catch (error) {
                console.error("Error fetching friends:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, []);

    if (loading) {
        return (
            <div className="bg-white shadow-sm w-[100vw] h-[100vh] animated-blue-gradient text-blue-900">
                <div className='w-[90vw] h-[90vh] m-auto pt-[30px]'>
                    <p className="text-gray-600 text-center">Loading friends list...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white shadow-sm w-[100vw] h-[100vh] animated-blue-gradient text-blue-900">
                <div className='w-[90vw] h-[90vh] m-auto pt-[30px]'>
                    <p className="text-red-500 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm w-[100vw] h-[100vh] animated-blue-gradient text-blue-900">
            <div className='w-[90vw] h-[90vh] m-auto pt-[30px]'>
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-[20px]">Friends List</h2>

                {friends.length > 0 ? (
                    <ul className="space-y-4">
                        {friends.map(friend => (
                            <li key={friend.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative">
                                <button onClick={() => handleSend(friend.id)} className="absolute top-2 right-2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200" >
                                    <ArrowRight size={18} />
                                </button>

                                <div className="flex flex-col space-y-2">
                                    <p className="font-medium text-gray-800">
                                        <strong>Name:</strong> {friend.name} {friend.apellidos}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <strong>Email:</strong> {friend.email}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <strong>Public Address:</strong> {formatPublicAddress(friend.public_address)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 text-center">You have no registered friends.</p>
                )}
            </div>
        </div>
    );
};

export default FriendTrue;