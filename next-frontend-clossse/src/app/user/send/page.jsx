'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from '../../components/menu/menu';

// Simulación de la lista de amigos
const friends = [
    {
        id: 1,
        name: 'Alice',
        username: 'alice123',
        email: 'alice@example.com',
    },
    {
        id: 2,
        name: 'Bob',
        username: 'bob456',
        email: 'bob@example.com',
    },
    {
        id: 3,
        name: 'Charlie',
        username: 'charlie789',
        email: 'charlie@example.com',
    },
];

export default function Home() {
    const router = useRouter();
    const [isFriend, setIsFriend] = useState(null); // null: no seleccionado, true: es amigo, false: no es amigo
    const [selectedFriend, setSelectedFriend] = useState(null); // Amigo seleccionado
    const [recipient, setRecipient] = useState(''); // Nombre de usuario o email del destinatario
    const [amountInEur, setAmountInEur] = useState(''); // Cantidad en €
    const [amountInBtc, setAmountInBtc] = useState(null); // Cantidad en BTC
    const [loading, setLoading] = useState(false); // Estado de carga para la conversión

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (!token) {
            router.push('/user/login');
        }
    }, [router]);

    // Función para convertir € a BTC usando una API
    const convertEurToBtc = async (amountInEur) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.coindesk.com/v1/bpi/currentprice/EUR.json`
            );
            if (!response.ok) {
                throw new Error('Error al obtener el precio de BTC');
            }
            const data = await response.json();
            const btcPriceInEur = data.bpi.EUR.rate_float; // Precio de 1 BTC en EUR
            const amountInBtc = amountInEur / btcPriceInEur; // Conversión
            setAmountInBtc(amountInBtc.toFixed(8)); // Mostrar 8 decimales
        } catch (error) {
            console.error('Error:', error);
            alert('Error al convertir el precio');
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amountInEur || isNaN(amountInEur)) {
            alert('Por favor, introduce una cantidad válida en €');
            return;
        }
        convertEurToBtc(parseFloat(amountInEur));
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <h1 className="text-2xl font-bold mb-4">Enviar BTC</h1>

            {/* Paso 1: Preguntar si el destinatario es un amigo */}
            {isFriend === null && (
                <div className="mb-4">
                    <p className="mb-2">¿El destinatario es un amigo?</p>
                    <button
                        onClick={() => setIsFriend(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                    >
                        Sí
                    </button>
                    <button
                        onClick={() => setIsFriend(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        No
                    </button>
                </div>
            )}

            {/* Paso 2.1: Mostrar lista de amigos si es un amigo */}
            {isFriend === true && (
                <div className="mb-4">
                    <p className="mb-2">Selecciona un amigo:</p>
                    <ul className="space-y-2">
                        {friends.map((friend) => (
                            <li
                                key={friend.id}
                                onClick={() => setSelectedFriend(friend)}
                                className={`p-2 cursor-pointer ${selectedFriend?.id === friend.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                    } rounded-lg`}
                            >
                                {friend.name} (@{friend.username})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Paso 2.2: Pedir nombre de usuario o email si no es un amigo */}
            {isFriend === false && (
                <div className="mb-4">
                    <p className="mb-2">Introduce el nombre de usuario o email del destinatario:</p>
                    <input
                        type="text"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Nombre de usuario o email"
                        className="p-2 border border-gray-300 rounded-lg w-full"
                    />
                </div>
            )}

            {/* Paso 3: Input para el precio en € y conversión a BTC */}
            {(isFriend !== null && (selectedFriend || recipient)) && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <p className="mb-2">Introduce la cantidad en €:</p>
                    <input
                        type="number"
                        value={amountInEur}
                        onChange={(e) => setAmountInEur(e.target.value)}
                        placeholder="Cantidad en €"
                        className="p-2 border border-gray-300 rounded-lg w-full mb-2"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                        {loading ? 'Convirtiendo...' : 'Convertir a BTC'}
                    </button>
                </form>
            )}

            {/* Paso 4: Mostrar el resultado de la conversión */}
            {amountInBtc !== null && (
                <div className="mt-4">
                    <p className="text-lg font-semibold">
                        {amountInEur} € = {amountInBtc} BTC
                    </p>
                </div>
            )}

            <Menu />
        </div>
    );
}