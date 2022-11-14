
const url = "http://localhost:8080";

export const addUser = async (data) => {
    await fetch(`${url}/api/user/register`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => {
        if(response.ok){
            window.location.pathname = "/login";

        }
        return response.json();
    })
};

export const pageAuthentication = async () => {
    await fetch(`${url}/api/auth/page`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => {
        if(!response.ok){
            window.location.pathname = "/login";
        }
        return response.json();
    })
};

export const loginUser = async (data) => {
    await fetch(`${url}/api/user/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => {
        if(response.ok){
            window.location.pathname = "/home";
        }
        return response.json();
    })
};