"use client";
import { useState } from 'react';
import { Menu } from '../../components/menu/menu';
import FriendTrue from '../../components/send/friendTrue';
// import FriendFalse from '../../components/send/friendFalse';
import NonUserForm from '../../components/send/noUserSend';

export function App() {
    const [currentStep, setCurrentStep] = useState(0); // Controla el paso actual
    const [isUser, setIsUser] = useState(false); // Estado para saber si es usuario
    const [isFriend, setIsFriend] = useState(null); // Estado para saber si es amigo

    // Función para manejar el clic en "Sí" (es usuario)
    const handleYesClick = () => {
        setIsUser(true); // Marcar como usuario
        setCurrentStep(1); // Avanzar al siguiente paso (preguntar si es amigo)
    };

    // Función para manejar el clic en "No" (no es usuario)
    const handleNoClick = () => {
        setIsUser(false); // Marcar como no usuario
        setCurrentStep(3); // Saltar directamente al formulario de no usuario
    };

    // Función para manejar la respuesta sobre si es amigo
    const handleFriendClick = (friendStatus) => {
        setIsFriend(friendStatus); // Guardar la respuesta
        if (friendStatus) {
            setCurrentStep(2); // Si es amigo, ir al listado de amigos
        } else {
            setCurrentStep(4); // Si no es amigo, ir al apartado "No es amigo"
        }
    };

    // Función para volver atrás
    const handleBackClick = () => {
        if (currentStep === 4) {
            // Si está en el apartado "No es amigo", volver al principio
            setCurrentStep(0);
        } else {
            // En otros casos, retroceder un paso
            setCurrentStep(prevStep => prevStep - 1);
        }
    };

    // Definición de los pasos
    const steps = [
        // Paso 0: Pregunta inicial (¿Es usuario de "clossse"?)
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

        // Paso 1: Pregunta si es amigo (solo si es usuario)
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

        // Paso 2: Listado de amigos (solo si es usuario y amigo)
        <div key="step2" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <FriendTrue />
        </div>,

        // Paso 3: Formulario para no usuarios
        <div key="step3" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            <NonUserForm />
        </div>,

        // Paso 4: Apartado "No es amigo"
        <div key="step4" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mt-8">
            {/* <FriendFalse /> */}
        </div>
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#7FFFD4] to-[#40E0D0] dark:from-gray-900 dark:to-[#008080] transition-colors duration-300">
            <main className="pt-20 px-4 max-w-7xl mx-auto">
                {/* Mostrar el paso actual */}
                {steps[currentStep]}

                {/* Botón para volver atrás (no se muestra en el paso 0) */}
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