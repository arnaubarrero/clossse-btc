'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../plugins/communicationManager';
import CryptoJS from 'crypto-js'; // Para encriptar el PIN

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState(['', '', '', '']); // Estado para los 4 dígitos del PIN
    const [error, setError] = useState('');
    const inputRefs = useRef([]); // Referencias para los campos de entrada del PIN

    // Función para manejar el cambio en los campos del PIN
    const handlePinChange = (index, value) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Mover el foco al siguiente campo si se ingresa un dígito
        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        // Mover el foco al campo anterior si se borra un dígito
        if (!value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // Función para manejar el envío del formulario
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(email, password);

            if (response.token) {
                // Encriptar el PIN antes de guardarlo en el localStorage
                const encryptedPin = CryptoJS.AES.encrypt(
                    pin.join(''), // Convertir el array de PIN a una cadena
                    'secret-key' // Clave secreta para encriptar (cámbiala por una clave segura)
                ).toString();

                // Guardar el PIN encriptado en el localStorage
                localStorage.setItem('EncryptedPIN', encryptedPin);

                // Redirigir al usuario
                router.push('/');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    // Redirigir al registro
    const reedireccionarRegistro = () => {
        router.push('/user/register');
    };

    // Verificar si el usuario ya está autenticado
    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 shadow-xl p-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                            CLOSSSE
                        </h1>
                        <p className="mt-2 text-gray-400">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />

                        {/* Campos de entrada para el PIN */}
                        <div className="flex justify-center space-x-2">
                            {pin.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    placeholder="·"
                                    value={digit}
                                    onChange={(e) => handlePinChange(index, e.target.value)}
                                    ref={(el) => (inputRefs.current[index] = el)} // Asignar referencia
                                    className="w-12 h-12 text-center bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <button
                            onClick={reedireccionarRegistro}
                            className="hover:cursor-pointer text-sm text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            Don't have an account? Sign up
                        </button>
                        <br />
                        <button className="hover:cursor-pointer text-sm text-gray-400 hover:text-blue-500 transition-colors">
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}