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
    const [showPinInput, setShowPinInput] = useState(true);
    const inputRefs = useRef([]);

    useEffect(() => {
        const encryptedPin = localStorage.getItem('EncryptedPIN');
        if (encryptedPin) {
            setShowPinInput(false);
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

    const redirectToRegister = () => {
        router.push('/user/register');
    };

    useEffect(() => {
        const token = localStorage.getItem('Login Token');
        if (token) {
            router.push('/');
        }
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center animated-blue-gradient text-blue-900">
            <div className="w-[95%] max-w-md">
                <div className="bg-white bg-opacity-25 shadow-lg rounded-lg p-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-blue-600">
                            CLOSSSE
                        </h1>
                        <p className="mt-2 text-gray-600">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-colors" />

                        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-colors" />

                        {showPinInput && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 text-center">
                                    This PIN will be used to sign transactions.
                                </p>
                                <div className="flex justify-center space-x-2">
                                    {pin.map((digit, index) => (
                                        <input key={index} type="text" required maxLength="1" placeholder="·" value={digit} onChange={(e) => handlePinChange(index, e.target.value)} ref={(el) => (inputRefs.current[index] = el)} className="w-12 h-12 text-center bg-gray-50 border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-colors" />
                                    ))}
                                </div>
                            </div>
                        )}

                        <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" >
                            Sign In
                        </button>
                    </form>

                    <div className="text-right space-y-4">
                        <button onClick={redirectToRegister} className="hover:cursor-pointer text-sm text-blue-600 hover:text-blue-700 transition-colors" >
                            Don't have an account? Sign up
                        </button>
                        <br />
                        <button className="hover:cursor-pointer text-sm text-blue-600 hover:text-blue-700 transition-colors" >
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}