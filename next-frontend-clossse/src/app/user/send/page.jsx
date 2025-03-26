"use client";
import { useState } from 'react';
import { Menu } from '../../components/menu/menu';
import FriendTrue from '../../components/send/friendTrue';
import FriendFalse from '../../components/send/friendFalse';
import NonUserForm from '../../components/send/noUserSend';
import { ArrowLeft } from 'lucide-react';

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
        setCurrentStep(0);
    };

    const steps = [
        <div key="step0" className="min-h-screen flex items-center justify-center animated-blue-gradient text-blue-900">
            <div className="w-[90%] max-w-md mx-auto bg-white shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    ¿Está el usuario en "clossse"?
                </h1>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={handleYesClick}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-lg">
                        Sí
                    </button>
                    <button
                        onClick={handleNoClick}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200 font-medium text-lg">
                        No
                    </button>
                </div>
            </div>
        </div>,

        <div key="step1" className="min-h-screen flex items-center justify-center animated-blue-gradient text-blue-900">
            <div className="w-[90%] max-w-md mx-auto bg-white shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">¿Es el usuario un amigo?</h2>
                <div className="flex flex-col space-y-4">
                    <button
                        onClick={() => handleFriendClick(true)}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-lg">
                        Sí
                    </button>
                    <button
                        onClick={() => handleFriendClick(false)}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200 font-medium text-lg">
                        No
                    </button>
                </div>
            </div>
        </div>,

        <div key="step2" className="min-h-[90vh]">
            <FriendTrue />
        </div>,

        <div key="step3" className="min-h-[90vh]">
            <NonUserForm />
        </div>,

        <div key="step4" className="min-h-[90vh]">
            <FriendFalse />
        </div>
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <main className="flex-1 w-full">
                {currentStep > 0 && (
                    <button
                        onClick={handleBackClick}
                        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700" />
                    </button>
                )}
                
                {steps[currentStep]}
            </main>

            <div className="fixed bottom-0 w-full">
                <Menu />
            </div>
        </div>
    );
}

export default App;