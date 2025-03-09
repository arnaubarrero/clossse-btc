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
    const [isFriend, setIsFriend] = useState(false);

    useEffect(() => {
        const pinVerifiedData = localStorage.getItem('PINVerified');

        if (!pinVerifiedData) {
            router.push('/user/send');
            return;
        }

        const { verified, timestamp } = JSON.parse(pinVerifiedData);

        const currentTime = new Date().getTime();
        const timeElapsed = currentTime - timestamp;
        const fifteenMinutesInMillis = 15 * 60 * 1000;

        if (!verified || timeElapsed > fifteenMinutesInMillis) {
            localStorage.removeItem('PINVerified');
            router.push('/user/send');
            return;
        }

        if (!slug) return;

        const fetchData = async () => {
            try {
                const currentUserInfo = await getUserInfo();
                setUserInfo(currentUserInfo);

                const friend = currentUserInfo.friends.find((friend) => friend.id === parseInt(slug));
                if (friend) {
                    setFriendInfo(friend);
                    setIsFriend(true);
                } else {
                    const userData = await getUserInfoById(slug);
                    setFriendInfo(userData);
                    setIsFriend(false);
                }
            } catch (err) {
                if (err.message.includes('404')) {
                    setError('Usuario no encontrado.');
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Cargando...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-xl font-semibold text-red-600 dark:text-red-400">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto p-6">
                {friendInfo && (
                    <div className="space-y-4">
                        <h2 className={`text-2xl font-semibold ${isFriend ? 'text-green-600' : 'text-red-600'}`}>
                            {isFriend ? 'Is your friend' : 'He is not your friend'}
                        </h2>

                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Nombre:</span> {friendInfo.name}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Apellidos:</span> {friendInfo.apellidos}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Email:</span> {friendInfo.email}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Dirección Pública:</span> {friendInfo.public_address}
                            </p>
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-semibold">Username:</span> {friendInfo.username}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}