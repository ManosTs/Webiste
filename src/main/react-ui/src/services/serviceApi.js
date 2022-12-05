
const url = "http://localhost:8080";

export const addUser = async ({username, email, password}) => {
    return await fetch(`${url}/api/user/register`, {
        method: 'POST',
        body: JSON.stringify({username:username, email:email, password:password}),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => response.json())
};

export const loginUser = async ({email, password}) => {
    return await fetch(`${url}/api/user/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        credentials: "include",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => response.json())

};

export const retrieveUsers = async ({page, size}) => {
    return await fetch(`${url}/api/user/getAll?pageNo=${page}&pageSize=${size}`, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => response.json())

};
