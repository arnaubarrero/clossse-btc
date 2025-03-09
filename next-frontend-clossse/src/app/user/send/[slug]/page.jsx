"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getUserInfo, getUserInfoById } from '../../../plugins/communicationManager';

export default function SendPage({ params }) {
    const router = useRouter();
    const { slug } = use(params);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [friendInfo, setFriendInfo] = useState(null);
    const [isFriend, setIsFriend] = useState(false); // Estado para saber si es amigo

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                // Obtener la información del usuario actual
                const currentUserInfo = await getUserInfo();
                setUserInfo(currentUserInfo);

                // Verificar si el usuario con el ID de la URL es amigo
                const friend = currentUserInfo.friends.find((friend) => friend.id === parseInt(slug));
                if (friend) {
                    setFriendInfo(friend);
                    setIsFriend(true);
                } else {
                    // Si no es amigo, obtener la información del usuario por su ID
                    const userData = await getUserInfoById(slug);
                    setFriendInfo(userData);
                    setIsFriend(false);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Enviar a Usuario con ID: {slug}</h1>
            {friendInfo && (
                <div>
                    <h2>{isFriend ? 'Este usuario es tu amigo.' : 'Este usuario no es tu amigo.'}</h2>
                    <p>Nombre: {friendInfo.name}</p>
                    <p>Apellidos: {friendInfo.apellidos}</p>
                    <p>Email: {friendInfo.email}</p>
                    <p>Dirección Pública: {friendInfo.public_address}</p>
                    <p>Username: {friendInfo.username}</p>
                </div>
            )}
        </div>
    );
}