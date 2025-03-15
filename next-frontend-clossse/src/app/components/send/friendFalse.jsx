"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirección
import { searchUsersTransaction } from '../../plugins/communicationManager'; // Importar la función de búsqueda

const FriendSearch = () => {
    const [searchQuery, setSearchQuery] = useState(''); // Estado para el input de búsqueda
    const [searchResults, setSearchResults] = useState([]); // Estado para los resultados de búsqueda
    const [loading, setLoading] = useState(false); // Estado para manejar la carga
    const [error, setError] = useState(null); // Estado para manejar errores
    const router = useRouter(); // Inicializar useRouter

    // Función para manejar la búsqueda
    const handleSearch = async () => {
        if (searchQuery.length < 4) {
            setError('Debes ingresar al menos 4 caracteres para buscar.');
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

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-[#008080] mb-4">Buscar Usuarios</h2>

            {/* Campo de búsqueda */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ingresa al menos 4 caracteres"
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008080] flex-grow"
                />
                <button
                    onClick={handleSearch}
                    disabled={searchQuery.length < 4}
                    className="px-8 py-2 bg-[#008080] hover:bg-[#006666] text-white rounded-lg transition-colors duration-200 font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Buscar
                </button>
            </div>

            {/* Mensajes de error o carga */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading && <p className="text-gray-600 mb-4">Buscando usuarios...</p>}

            {/* Resultados de la búsqueda */}
            {searchResults.length > 0 ? (
                <ul>
                    {searchResults.map(user => (
                        <li
                            key={user.id}
                            className="mb-2 p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleUserClick(user.id)} // Redirigir al hacer clic
                        >
                            <p className="font-semibold">{user.name} {user.apellidos}</p>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600">
                                <strong>Dirección Pública:</strong> {user.public_address}
                            </p>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No se encontraron usuarios.</p>
            )}
        </div>
    );
};

export default FriendSearch;