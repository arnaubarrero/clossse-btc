"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirección
import { searchUsersTransaction } from '../../plugins/communicationManager'; // Importar la función de búsqueda
import { Search, ArrowRight } from 'lucide-react'; // Iconos de lupa y flecha

const FriendSearch = () => {
    const [searchQuery, setSearchQuery] = useState(''); // Estado para el input de búsqueda
    const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda
    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const router = useRouter(); // Inicializar useRouter

    // Función para manejar la búsqueda
    const handleSearch = async () => {
        if (searchQuery.length < 4) {
            setError('Please enter at least 4 characters to search.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await searchUsersTransaction(searchQuery); // Realizar la búsqueda
            setSearchResults(data); // Guardar los resultados
        } catch (error) {
            setError(error.message); // Manejar errores
        } finally {
            setLoading(false); // Finalizar la carga
        }
    };

    // Función para redirigir a la página del usuario
    const handleUserClick = (userId) => {
        router.push(`/user/send/${userId}`); // Redirigir a /user/send/id_user
    };

    // Función para formatear la dirección pública
    const formatPublicAddress = (address) => {
        if (address.length <= 10) return address; // Si la dirección es corta, no la formateamos
        return `${address.slice(0, 5)}...${address.slice(-5)}`; // Mostrar primeros 5 y últimos 5 caracteres
    };

    return (
        <div className="bg-white shadow-sm w-[100vw] h-[100vh] animated-blue-gradient text-blue-900">
            <div className='w-[90vw] h-[90vh] m-auto pt-[30px]'>
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-[20px]">Search Users</h2>

                {/* Campo de búsqueda */}
                <div className="flex mb-6">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter at least 4 characters"
                        className="px-4 py-2 border border-black-300 transition-[2s] focus:outline-none flex-grow"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={searchQuery.length < 4}
                        className="outline-0 p-2 bg-blue-500 hover:bg-blue-600 text-white transition-[2s] font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        <Search size={20} className="text-white" /> {/* Icono de lupa */}
                    </button>
                </div>

                {/* Mensajes de error o carga */}
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {loading && <p className="text-gray-600 mb-4 text-center">Searching users...</p>}

                {/* Resultados de la búsqueda */}
                {searchResults.length > 0 ? (
                    <ul className="space-y-4">
                        {searchResults.map(user => (
                            <li
                                key={user.id}
                                className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 relative"
                            >
                                {/* Icono de flecha en la esquina superior derecha */}
                                <button
                                    onClick={() => handleUserClick(user.id)}
                                    className="absolute top-2 right-2 p-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200"
                                >
                                    <ArrowRight size={18} /> {/* Icono de flecha */}
                                </button>

                                {/* Información del usuario */}
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