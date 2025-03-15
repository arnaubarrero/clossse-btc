"use client";
import { useState } from 'react';
import { Menu } from '../../components/menu/menu';
import FriendTrue from '../../components/send/friendTrue';
import FriendFalse from '../../components/send/friendFalse';
import NonUserForm from '../../components/send/noUserSend';

export function App() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isUser, setIsUser] = useState(false);
    const [isFriend, setIsFriend] = useState(null);
    
    const handleYesClick = () => {
        setIsUser(true);
        setCurrentStep(1);
    };

    const handleNoClick = () => {
        setIsUser(false);
        setCurrentStep(3);
    };

    const handleFriendClick = (friendStatus) => {
        setIsFriend(friendStatus);
        if (friendStatus) {
            setCurrentStep(2);
        } else {
            setCurrentStep(4);
        }
    };

    const handleBackClick = () => {
        if (currentStep === 4) {
            setCurrentStep(0);
        } else {
            setCurrentStep(prevStep => prevStep - 1);
        }
    };

    const steps = [
        <div key="step0" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <h1 className="text-3xl font-bold text-[#008080] dark:text-[#40E0D0] mb-8 text-center">
                ¿Es usuario de "clossse"?
            </h1>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={handleYesClick}
                    className="px-8 py-3 bg-[#008080] hover:bg-[#006666] dark:bg-[#40E0D0] dark:hover:bg-[#30B0A0] text-white dark:text-gray-800 rounded-lg transition-colors duration-200 font-semibold">
                    Sí
                </button>
                <button
                    onClick={handleNoClick}
                    className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 font-semibold">
                    No
                </button>
            </div>
        </div>,

        <div key="step1" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8 text-center">
            <h2 className="text-2xl font-bold text-[#008080] dark:text-[#40E0D0] mb-4">¿Es amigo?</h2>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => handleFriendClick(true)}
                    className="px-8 py-3 bg-[#008080] hover:bg-[#006666] dark:bg-[#40E0D0] dark:hover:bg-[#30B0A0] text-white dark:text-gray-800 rounded-lg transition-colors duration-200 font-semibold">
                    Sí
                </button>
                <button
                    onClick={() => handleFriendClick(false)}
                    className="px-8 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200 font-semibold">
                    No
                </button>
            </div>
        </div>,

        <div key="step2" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <FriendTrue />
        </div>,

        <div key="step3" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <NonUserForm />
        </div>,

        <div key="step4" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <FriendFalse />
        </div>
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7FFFD4] to-[#40E0D0] dark:from-gray-900 dark:to-[#008080] transition-colors duration-300">
            <main className="pt-20 px-4 max-w-7xl mx-auto">
                {steps[currentStep]}

                {currentStep > 0 && (
                    <div className="fixed top-1 left-1">
                        <button onClick={handleBackClick} className="text-3xl px-8 py-3 text-gray-200">
                            ←
                        </button>
                    </div>
                )}
            </main>

            <Menu />
        </div>
    );
}

export default App;