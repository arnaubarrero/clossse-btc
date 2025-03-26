'use client';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';
import { logout, getUserInfo, updateUsername } from '../../plugins/communicationManager';

// CREAR QR CON EL USUARIO E ID

export default function Home() {
    const router = useRouter();
    const [userInfo, setUserInfo] = useState(null);
    

    return (
        <div className='min-h-screen flex items-center justify-center animated-blue-gradient text-blue-900'>
            <h1>Hola</h1>

            <Menu />
        </div>
    );
}