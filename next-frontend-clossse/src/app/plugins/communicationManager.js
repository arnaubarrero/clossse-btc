const Host = process.env.NEXT_PUBLIC_CM_HOST;

// ========= POST =======================
export const login = async (email, password) => {
    try {
        const response = await fetch(`${Host}/autentificacio/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json(); 
        localStorage.setItem('Login Token', data.token)
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

export const register = async (name, apellidos, email, password,password_confirmation) => {
    try {
        const response = await fetch(`${Host}/autentificacio/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, apellidos, email, password, password_confirmation }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json(); 
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};

// ========= GET ========================
export const getNameWithToken = async () => {
    try {
        const token = localStorage.getItem('Login Token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${Host}/user/name`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};