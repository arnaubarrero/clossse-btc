"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { getUserInfo } from '../../../plugins/communicationManager';

export default function SendPage({ params }) {
    const router = useRouter();
    const { slug } = use(params);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [friendInfo, setFriendInfo] = useState(null);

    useEffect(() => {
        if (!slug) return;

        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUserInfo(data);
                const friend = data.friends.find((friend) => friend.id === parseInt(slug));
                if (friend) {
                    setFriendInfo(friend);
                } else {
                    setError('Amigo no encontrado');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
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
                    <h2>Información del Amigo:</h2>
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