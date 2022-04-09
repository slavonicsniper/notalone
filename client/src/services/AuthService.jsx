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
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
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
    let resData = await fetch(process.env.REACT_APP_API_URL + '/users/confirm/' + code, requestOptions)
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.statusText);
            }
        })
        .then(async (result) => {
                return result;
            },
            (error) => {
                return error;
        });
    return resData;
};


export default {
  login,
  logout,
  register,
  verifyUser
}
