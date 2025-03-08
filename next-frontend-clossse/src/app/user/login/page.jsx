'use client';
import { useState,useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../plugins/communicationManager';

export default function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(email, password);

            if (response.token) {
                router.push('/user/home');
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
            router.push('/user/home');
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
                        </button><br />
                        <button
                            className="hover:cursor-pointer text-sm text-gray-400 hover:text-blue-500 transition-colors"
                        >
                            Forgot your password?
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}