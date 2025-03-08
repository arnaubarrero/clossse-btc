'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
// import { getNameWithToken } from '../../plugins/communicationManager';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) { 
            router.push('/user/login');
        } else {
        }
    }, [router]);

    return (
        <div>
            Menu Personal
            < Menu />
        </div>
    );
}