"use client";
import { useEffect, useState } from 'react';
import { getFriendsList } from '../../plugins/communicationManager';
import { useRouter } from 'next/navigation'; // Importar useRouter

const FriendTrue = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter(); // Inicializar useRouter

    // Función para formatear la dirección pública
    const formatPublicAddress = (address) => {
        if (!address || address.length < 8) {
            return address || 'No disponible';
        }
        const firstThree = address.slice(0, 3);
        const lastFive = address.slice(-5);
        return `${firstThree}...${lastFive}`;
    };

    // Función para redirigir a /user/send/id_user
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
            <div className="p-4 bg-white rounded-lg shadow-md">
                <p>Cargando lista de amigos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Lista de Amigos</h2>
            {friends.length > 0 ? (
                <ul>
                    {friends.map(friend => (
                        <li key={friend.id} className="mb-2">
                            <p className="font-semibold">{friend.name} {friend.apellidos}</p>
                            <p className="text-gray-600">{friend.email}</p>
                            <p className="text-gray-600">
                                <strong>Dirección Pública:</strong> {formatPublicAddress(friend.public_address)}
                            </p>
                            <button
                                onClick={() => handleSend(friend.id)} // Redirigir al hacer clic
                                className="px-4 py-2 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition-colors"
                            >
                                Enviar
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes amigos registrados.</p>
            )}
        </div>
    );
};

export default FriendTrue;