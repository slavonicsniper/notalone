const fetchUserAvailabilities = async () => {
    const requestOptions = {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/availabilities', requestOptions)
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

const saveAvailabilities = async (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/availabilities', requestOptions)
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

const deleteAvailabilities = async (data) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(process.env.REACT_APP_API_URL + '/availabilities', requestOptions)
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
    fetchUserAvailabilities,
    saveAvailabilities,
    deleteAvailabilities
}