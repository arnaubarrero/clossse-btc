'use client';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { login } from '../../plugins/communicationManager';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [showPinInput, setShowPinInput] = useState(true); // Estado para controlar la visibilidad del PIN
    const inputRefs = useRef([]);

    // Verificar si existe un EncryptedPIN en el localStorage al cargar el componente
    useEffect(() => {
        const encryptedPin = localStorage.getItem('EncryptedPIN');
        if (encryptedPin) {
            setShowPinInput(false); // Ocultar el bloque de entrada del PIN
        }
    }, []);

    const handlePinChange = (index, value) => {
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < 3) {
            inputRefs.current[index + 1].focus();
        }

        if (!value && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(email, password);

            if (response.token) {
                // Solo encriptar y guardar el PIN si el bloque de entrada está visible
                if (showPinInput) {
                    const encryptedPin = CryptoJS.AES.encrypt(
                        pin.join(''),
                        'secret-key'
                    ).toString();
                    localStorage.setItem('EncryptedPIN', encryptedPin);
                }
                router.push('/');
            }
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    const reedireccionarRegistro = () => {
        router.push('/user/register');
    };

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-[#f6faff] dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-xl p-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#008080] to-[#7FFFD4] bg-clip-text text-transparent">
                            CLOSSSE
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-500/10">
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
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors"
                        />

                        {/* Mostrar el bloque de entrada del PIN solo si showPinInput es true */}
                        {showPinInput && (
                            <div className="flex justify-center space-x-2">
                                {pin.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        required
                                        maxLength="1"
                                        placeholder="·"
                                        value={digit}
                                        onChange={(e) => handlePinChange(index, e.target.value)}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        className="w-12 h-12 text-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors"
                                    />
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-[#008080] hover:bg-[#40E0D0] text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <button
                            onClick={reedireccionarRegistro}
                            className="hover:cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-[#40E0D0] transition-colors"
                        >
                            Don't have an account? Sign up
                        </button>
                        <br />
                        <button
                            className="hover:cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-[#40E0D0] transition-colors"
                        >
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}