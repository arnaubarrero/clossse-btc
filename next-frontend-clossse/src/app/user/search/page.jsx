'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';

export default function Home() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        }
    }, [router]);

    useEffect(() => {
        if (searchTerm.length >= 6) {
            const fetchResults = async () => {
                try {
                    const response = await fetch(`http://localhost:8000/api/search?query=${searchTerm}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSearchResults(data);
                    } else {
                        console.error('Error en la búsqueda');
                    }
                } catch (error) {
                    console.error('Error al conectar con la API:', error);
                }
            };
    
            fetchResults();
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-blue-500 mb-8 text-center">
                    CLOSSSE
                </h1>

                <div className="flex items-center justify-center space-x-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search User"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-md px-4 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-colors duration-300"
                    />
                    <button className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
                        <Image src="/qr.svg" width={25} height={25} alt="QR" className="filter  dark:filter-none" />
                    </button>
                </div>

                {searchResults.length > 0 && (
                    <div className="mt-4">
                        <h2 className="text-xl font-semibold mb-4">Resultados de la búsqueda:</h2>
                        <ul className="space-y-2">
                            {searchResults.map((user) => (
                                <li key={user.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <span className="font-medium">{user.username}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Menu />
        </div>
    );
}