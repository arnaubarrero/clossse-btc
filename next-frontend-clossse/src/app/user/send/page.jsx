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
        <div key="step0" className="bg-white rounded-lg shadow-sm ">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Is the user on "clossse"?
            </h1>
            <div className=" block gap-4 justify-center">
                <button
                    onClick={handleYesClick}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 font-medium">
                    Yes
                </button>
                <button
                    onClick={handleNoClick}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 font-medium">
                    No
                </button>
            </div>
        </div>,

        <div key="step1" className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Is the user a friend?</h2>
            <div className="flex gap-4 justify-center">
                <button
                    onClick={() => handleFriendClick(true)}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 font-medium">
                    Yes
                </button>
                <button
                    onClick={() => handleFriendClick(false)}
                    className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 font-medium">
                    No
                </button>
            </div>
        </div>,

        <div key="step2" className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
            <FriendTrue />
        </div>,

        <div key="step3" className="">
            <NonUserForm />
        </div>,

        <div key="step4" className="bg-0">
            <FriendFalse />
        </div>
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center pb-[10vh]"> {/* Aseguramos espacio para el menú */}
            <main className="w-full flex-1 flex flex-col justify-center items-center">
                {steps[currentStep]}

                {currentStep > 0 && (
                    <div className="mt-6">
                        <button
                            onClick={handleBackClick}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors duration-200 font-medium"
                        >
                            ← Back
                        </button>
                    </div>
                )}
            </main>

            <Menu />
        </div>
    );
}

export default App;