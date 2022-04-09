const getUsers = async (queryParams) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users' + queryParams, requestOptions)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

const getUser = async (uuid) => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/' + uuid, requestOptions)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

const getProfile = async () => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/profile', requestOptions)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}


const updateProfile = async (data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/profile', requestOptions)
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
    }
}

export default {
    getUsers,
    getUser,
    getProfile,
    updateProfile,
}