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

export const register = async (name, apellidos, email, password, password_confirmation) => {
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

export const updateUsername = async (newUsername) => {
    const token = localStorage.getItem('Login Token');
    const response = await fetch(`${Host}/update-username`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el nombre de usuario');
    }

    return response.json();
};

export const transferBTC = async () => {

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

export const getUserInfo = async () => {
    const token = localStorage.getItem('Login Token');

    if (!token) {
        throw new Error('No hay token de autenticación.');
    }

    try {
        const response = await fetch(`${Host}/user-info`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener la información del usuario.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getUserInfo:', error);
        throw error;
    }
};

export const getUserInfoById = async (userId) => {
    const token = localStorage.getItem('Login Token');

    if (!token) {
        throw new Error('No hay token de autenticación.');
    }

    try {
        const response = await fetch(`${Host}/getUserInfoById/${userId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener la información del usuario.');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en getUserInfoById:', error);
        throw error;
    }
};

export const getFriendsList = async () => {
    try {
        const token = localStorage.getItem('Login Token');

        if (!token) {
            throw new Error('No se encontró el token de autenticación.');
        }

        const response = await fetch(`${Host}/friends`, {
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
        console.error('Error al obtener la lista de amigos:', error);
        throw error;
    }
};

// ========= LOGOUT =====================
export const logout = async () => {
    try {
        const token = localStorage.getItem('Login Token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${Host}/autentificacio/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        localStorage.removeItem('Login Token');
        return { message: 'Logout exitoso' };
    } catch (error) {
        console.error('Error en la solicitud:', error);
        throw error;
    }
};


// ========= SEARCH ========================
export const searchUsers = async (query) => {
    try {
        const token = localStorage.getItem('Login Token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${Host}/search?query=${query}`, {
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
        console.error('Error en la búsqueda:', error);
        throw error;
    }
};

export const searchUsersTransaction = async (query) => {
    try {
        const token = localStorage.getItem('Login Token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${Host}/search-users?query=${query}`, {
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
        console.error('Error en la búsqueda de usuarios:', error);
        throw error;
    }
};

// ========= ADD FRIEND =====================
export const addFriend = async (friendId) => {
    try {
        const token = localStorage.getItem('Login Token');

        if (!token) {
            throw new Error('No hay token de autenticación');
        }

        const response = await fetch(`${Host}/add-friend`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ friend_id: friendId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al agregar amigo:', error);
        throw error;
    }
};