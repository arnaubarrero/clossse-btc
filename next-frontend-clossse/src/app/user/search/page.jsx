'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-blue-500 mb-8 text-center">
                    Search a User
                </h1>


                <div className="flex items-center justify-center space-x-4 mb-8">
                    <input type="text" placeholder="Search User"
                        className="w-full transition-[1s] max-w-md px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300">
                        <Image src="/qr.svg" width={25} height={25} alt="QR" />
                    </button>
                </div>
            </div>

            <Menu />
        </div>
    );
}