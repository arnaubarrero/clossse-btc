"use client";
import { useEffect, useState } from 'react';

const FriendTrue = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFriends = async () => {
            const token = localStorage.getItem('Login Token');

            if (!token) {
                setError("No se encontró el token de autenticación.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:8000/api/friends', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener la lista de amigos.');
                }

                const data = await response.json();
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
                            {friend.name} {friend.apellidos} ({friend.email})
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