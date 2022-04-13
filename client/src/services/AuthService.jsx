const login = async (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/login', requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

const logout = async () => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/logout', requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

const register = async (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/register', requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

const verifyUser = async (code) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/confirm/' + code, requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
};

const initializePasswordReset = async (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/reset-password/', requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

const verifyPasswordReset = async (code, body) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/reset-password/' + code, requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
};


export default {
  login,
  logout,
  register,
  verifyUser,
  initializePasswordReset,
  verifyPasswordReset
}
