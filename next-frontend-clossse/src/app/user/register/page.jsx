'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../plugins/communicationManager';

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirmation, setPassword_confirmation] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        
        try {
            await register(name, apellidos, email, password, password_confirmation);
            router.push('/user/login');
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message === 'Error 409: Conflict'
                ? 'Email already exists'
                : 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f6faff] dark:bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-gray-800 shadow-xl p-8 space-y-8 ">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#008080] to-[#7FFFD4] bg-clip-text text-transparent">
                            CLOSSSE
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Create your account</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors rounded-md"
                            />
                            <input
                                type="text"
                                placeholder="Surname"
                                required
                                value={apellidos}
                                onChange={(e) => setApellidos(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors rounded-md"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors rounded-md"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors rounded-md"
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                required
                                value={password_confirmation}
                                onChange={(e) => setPassword_confirmation(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#008080] focus:ring-1 focus:ring-[#008080] transition-colors rounded-md"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 bg-[#008080] hover:bg-[#40E0D0] text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#008080] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center rounded-md"
                        >
                            {loading ? (
                                <>
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <button
                            onClick={() => router.push('/user/login')}
                            className="hover:cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-[#40E0D0] transition-colors"
                        >
                            Already have an account? Sign in
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}