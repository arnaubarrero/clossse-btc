"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, QrCode } from 'lucide-react'; // Importa el ícono de QR
import { searchUsersTransaction } from '../../plugins/communicationManager';

const FriendSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleSearch = async () => {
        if (searchQuery.length < 4) {
            setError('Please enter at least 4 characters to search.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchUsersTransaction(searchQuery);
            setSearchResults(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = (userId) => {
        router.push(`/user/send/${userId}`);
    };

    const formatPublicAddress = (address) => {
        if (address.length <= 10) return address;
        return `${address.slice(0, 5)}...${address.slice(-5)}`;
    };

    return (
        <div className="bg-white shadow-sm w-[100vw] h-[100vh] animated-blue-gradient text-blue-900">
            <div className='w-[90vw] h-[90vh] m-auto pt-[30px]'>
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-[20px]">Search Users</h2>

                <div className="flex mb-6">
                    <input type="text"  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Enter at least 4 characters" className="rounded-md px-4 py-2 border border-black-300 transition-[2s] focus:outline-none flex-grow"  />
                    <button onClick={handleSearch} disabled={searchQuery.length < 4} className="ml-[10px] rounded-md outline-0 p-2 bg-blue-500 hover:bg-blue-600 text-white transition-[2s] font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"  >
                        <Search size={20} className="text-white" />
                    </button>
                    
                    <button className="ml-[10px] rounded-md outline-0 p-2 bg-blue-800 hover:bg-blue-600 text-white transition-[2s] font-medium flex items-center justify-center" onClick={() => {console.log("QR button clicked");}} >
                        <QrCode size={20} className="text-white" />
                    </button>
                </div>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {loading && <p className="text-gray-600 mb-4 text-center">Searching users...</p>}

                {searchResults.length > 0 ? (
                    <ul className="space-y-4">
                        {searchResults.map(user => (
                            <li key={user.id} className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative" >
                                <button onClick={() => handleUserClick(user.id)} className="absolute top-2 right-2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200" >
                                    <ArrowRight size={18} />
                                </button>

                                <div className="flex flex-col space-y-2">
                                    <p className="font-medium text-gray-800"> <strong>Username:</strong> {user.name} {user.apellidos}</p>
                                    <p className="text-gray-600 text-sm"> <strong>Email:</strong> {user.email}</p>
                                    <p className="text-gray-600 text-sm">
                                        <strong>Public Address:</strong> {formatPublicAddress(user.public_address)}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && <p className="text-gray-600 text-center">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default FriendSearch;