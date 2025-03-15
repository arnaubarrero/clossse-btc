"use client";
import { useEffect, useState } from 'react';

const FriendFalse = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
       
    }, []);

    if (error) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1>Hola, me voy al gym un rato</h1>
        </div>
    );
};

export default FriendFalse;