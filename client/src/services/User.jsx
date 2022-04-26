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
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
        return {
            status: "Failed",
            message: "Something went wrong!"
        }
    }
}

const getUser = async () => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/me', requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
        return {
            status: "Failed",
            message: "Something went wrong!"
        }
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
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
        return {
            status: "Failed",
            message: "Something went wrong!"
        }
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
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
        return {
            status: "Failed",
            message: "Something went wrong!"
        }
    }
}

const deleteProfile = async () => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/users/profile', requestOptions)
        const json = await response.json();
        return json;
    } catch(err) {
        console.error(err);
        return {
            status: "Failed",
            message: "Something went wrong!"
        }
    }
}

export default {
    getUsers,
    getUser,
    getProfile,
    updateProfile,
    deleteProfile
}