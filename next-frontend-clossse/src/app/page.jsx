'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from './components/menu/menu';
import { getNameWithToken } from './plugins/communicationManager';

export default function Home() {
    const router = useRouter();
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) { 
            router.push('/user/login');
        } else {
            fetchUserName(token);
        }
    }, [router]);

    const fetchUserName = async (token) => {
        try {
            const data = await getNameWithToken(token);
            setUserName(data.name);
        } catch (error) {
            console.error('Error:', error);
            router.push('/user/login');
        }
    };

    return (
        <div>
            <h1>Bienvenido, {userName}</h1>
            < Menu />
        </div>
    );
}