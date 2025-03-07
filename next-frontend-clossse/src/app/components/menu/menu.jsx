'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Menu() {
    return (
        <>
            <div className="w-[100vw] max-w-[800px] bg-gradient-to-t from-blue-900 to-gray-900 fixed bottom-0 left-1/2 transform -translate-x-1/2 rounded-t-3xl shadow-lg">
                <div className="flex justify-around items-center p-4">
                    <Link href="/user/home">
                        <div className="p-1 rounded-full hover:bg-gray-700 transition duration-300">
                            <Image src="/home.svg" width={30} height={30} alt="Home" />
                        </div>
                    </Link>
                    <Link href="/profile">
                        <div className="p-1 rounded-full hover:bg-gray-700 transition duration-300">
                            <Image src="/user.svg" width={30} height={30} alt="User" />
                        </div>
                    </Link>
                    <Link href="/search">
                        <div className="p-1 rounded-full hover:bg-gray-700 transition duration-300">
                            <Image src="/send.svg" width={40} height={40} alt="Send" />
                        </div>
                    </Link>
                    <Link href="/search">
                        <div className="p-1 rounded-full hover:bg-gray-700 transition duration-300">
                            <Image src="/search.svg" width={30} height={30} alt="Search" />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}