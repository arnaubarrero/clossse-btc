'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Send, User } from 'lucide-react'; // Importamos los iconos de Lucide

export function Menu() {
    const pathname = usePathname();

    // Función para determinar si el enlace está activo
    const isActive = (path) => pathname === path;

    return (
        <>
            <div className="w-[100vw] bg-white/90 backdrop-blur-md fixed bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg border-t border-gray-200">
                <div className="flex justify-around items-center py-3">
                    {/* Enlace Home */}
                    <Link href="/">
                        <div className={`flex flex-col items-center ${isActive('/') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
                            <Home size={28} strokeWidth={isActive('/') ? 2.5 : 2} /> {/* Icono Home */}
                            <span className="text-xs mt-1">Home</span>
                        </div>
                    </Link>

                    {/* Enlace Search */}
                    <Link href="/user/search">
                        <div className={`flex flex-col items-center ${isActive('/user/search') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
                            <Search size={28} strokeWidth={isActive('/user/search') ? 2.5 : 2} /> {/* Icono Search */}
                            <span className="text-xs mt-1">Search</span>
                        </div>
                    </Link>

                    {/* Enlace Send */}
                    <Link href="/user/send">
                        <div className={`flex flex-col items-center ${isActive('/user/send') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
                            <Send size={28} strokeWidth={isActive('/user/send') ? 2.5 : 2} /> {/* Icono Send */}
                            <span className="text-xs mt-1">Send</span>
                        </div>
                    </Link>

                    {/* Enlace Perfil */}
                    <Link href="/user/perfil">
                        <div className={`flex flex-col items-center ${isActive('/user/perfil') ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
                            <User size={28} strokeWidth={isActive('/user/perfil') ? 2.5 : 2} /> {/* Icono User */}
                            <span className="text-xs mt-1">Profile</span>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}