const url = "http://localhost:8080"


export async function createUser(data){

    return await fetch(url + '/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            password: data.password

        }),
    });
}

export async function authUser(data){
    return await fetch(url + '/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password

        }),
    });
}

export async function logoutUser(data){
    return await fetch(url + '/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: data.email,
            password: data.password

        }),
    });
}


export async function getAllUsers(){
    return await fetch(url + '/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function getUserInfoById(userId){
    return await fetch(url + '/api/users/' + userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}
