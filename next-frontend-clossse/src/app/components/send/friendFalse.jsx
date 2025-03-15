"use client";
import { useEffect, useState } from 'react';
import { searchUsersTransaction } from '../../plugins/communicationManager';

const FriendFalse = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async () => {
        if (searchQuery.length < 4) {
            setError('Debes ingresar al menos 4 caracteres para buscar.');
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
                        <li key={user.id} className="mb-2 p-2 border-b border-gray-200">
                            <p className="font-semibold">{user.name} {user.apellidos}</p>
                            <p className="text-gray-600">{user.username}</p>
                            <p className="text-gray-600">{user.email}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p>No se encontraron usuarios.</p>
            )}
        </div>
    );
};

export default FriendFalse;