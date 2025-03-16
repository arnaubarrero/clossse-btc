"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, User, Wallet, Copy, Eye } from 'lucide-react';
import { getUserInfoById, transferBTC } from '../../../plugins/communicationManager'; // Importar transferBTC
import Swal from 'sweetalert2';

const UserSendPage = () => {
    const params = useParams();
    const userId = params.slug;
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState(''); // Estado para el monto a transferir

    // Obtener la información del usuario al cargar el componente
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfoById(userId);
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

    // Formatear la dirección pública para mostrarla parcialmente
    const formatPublicAddress = (address) => {
        if (!address || address.length < 10) {
            return address || 'No disponible';
        }
        const firstFive = address.slice(0, 5);
        const lastFive = address.slice(-5);
        return `${firstFive}...${lastFive}`;
    };

    // Mostrar la dirección pública completa en un modal
    const showFullAddress = (address) => {
        Swal.fire({
            title: 'Dirección Pública Completa',
            text: address,
            icon: 'info',
            confirmButtonText: 'Cerrar',
        });
    };

    // Copiar la dirección pública al portapapeles
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            Swal.fire({
                title: '¡Copiado!',
                text: 'La dirección pública ha sido copiada al portapapeles.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
        });
    };

    // Función para manejar la transferencia de BTC
    const handleTransfer = async () => {
        if (!amount || amount <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa un monto válido.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        if (!user?.public_address) {
            Swal.fire({
                title: 'Error',
                text: 'No se encontró la dirección pública del usuario.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            return;
        }

        try {
            // Llamar a la función transferBTC desde communicationManager
            const response = await transferBTC(userId, amount, user.public_address);

            Swal.fire({
                title: 'Éxito',
                text: 'Transferencia realizada con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            console.log('Respuesta del servidor:', response);
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
            console.error('Error en la transferencia:', error);
        }
    };

    // Mostrar un mensaje de error si ocurre algún problema
    if (error) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-md">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#deffff] to-[#b5ffe6] flex items-center justify-center p-4">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-[#008080] mb-6 flex items-center gap-2">
                    <User className="w-8 h-8" />
                    Enviar a Usuario
                </h1>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-8 h-8 text-[#008080] animate-spin" />
                    </div>
                ) : user ? (
                    <div className="space-y-6">
                        <div className="bg-[#7FFFD4]/10 p-4 rounded-lg border border-[#008080]/20">
                            <div className="mb-4">
                                <label className="text-sm text-gray-600 block mb-1">Nombre de usuario</label>
                                <p className="text-lg font-semibold text-[#008080] flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    {user.username}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-gray-600 block mb-1">Dirección Pública</label>
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-[#008080]" />
                                    <code className="text-black px-2 py-1 rounded text-sm break-all">
                                        {formatPublicAddress(user.public_address)}
                                    </code>
                                    <button onClick={() => showFullAddress(user.public_address)} className="text-[#008080] hover:text-[#006666] transition-colors duration-200" >
                                        <Eye className="w-5 h-5" />
                                    </button>

                                    <button onClick={() => copyToClipboard(user.public_address)} className="text-[#008080] hover:text-[#006666] transition-colors duration-200" >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-sm text-gray-600 block mb-1">Monto de BTC a enviar</label>
                                <input
                                    type="number"
                                    placeholder="Ingresa el monto"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="text-gray-600 w-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#008080]"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleTransfer}
                            className="w-full bg-[#008080] hover:bg-[#008080]/90 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            Continuar con el envío
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No se encontró información del usuario.
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserSendPage;