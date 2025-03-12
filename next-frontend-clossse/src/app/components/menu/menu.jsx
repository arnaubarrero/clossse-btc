'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Menu() {
    const pathname = usePathname();
    const isHome = pathname === '/user/home';

    return (
        <>
            <div className="w-[90vw] bg-gradient-to-r from-[#58d6ac] to-[#008080] fixed bottom-[20px] left-1/2 transform -translate-x-1/2 rounded-3xl shadow-lg">
                <div className="flex justify-around items-center p-3">
                    <Link href="/">
                        <div className="rounded-full transition duration-300">
                            <Image src="/home.svg" width={25} height={25} alt="Home" />
                        </div>
                    </Link>
                    <Link href="/user/search">
                        <div className="rounded-full transition duration-300">
                            <Image src="/search.svg" width={25} height={25} alt="search" />
                        </div>
                    </Link>
                    <Link href="/user/send">
                        <div className="rounded-full transition duration-300">
                            <Image src="/send.svg" width={35} height={35} alt="Send" />
                        </div>
                    </Link>
                    <Link href="/user/perfil">
                        <div className="rounded-full transition duration-300">
                            <Image src="/user.svg" width={25} height={25} alt="User" />
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}