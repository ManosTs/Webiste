import {toast} from "react-toastify";
import LoaderSpinner from "../components/LoaderSpinner";

const url = "http://localhost:8080";

export const addUser = async ({username, email, firstName, lastName, gender, birthDate,password}) => {
    return await fetch(`${url}/api/user/public/register`, {
        method: 'POST',
        body: JSON.stringify({username:username, firstName:firstName, lastName:lastName, gender:gender, birthDate:birthDate,email:email, password:password}),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => response.json())
};

export const loginUser = async ({email, password}) => {
    return await fetch(`${url}/api/user/public/login`, {
        method: 'POST',
        body: JSON.stringify({
            email: email,
            password: password
        }),
        credentials: "include",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => {
        if(response.ok) {
            return response.json();
        }
    })

};

export const retrieveUsers = async ({page, size, id}) => {
    return await fetch(`${url}/api/user/getAll?pageNo=${page}&pageSize=${size}`, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',

        },

    }).then(response => {
        if(response.ok) {
            return response.json();
        }
        if(response.status === 401){
            refreshToken({id});

        }

    })

};

export const logout = async ({id}) => {
    return await fetch(`${url}/api/user/public/logout?id=${id}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },

    }).then(response => {
        if(response.ok){
            return response.json();
        }

    })

};

export const refreshToken = async ({id}) => {

    await fetch(`${url}/api/user/public/refresh-token`, {
        method: 'GET',
        credentials: "include",
        headers: {
            'Content-type': 'application/text; charset=UTF-8',
        },

    }).then(response => {
        if(response.status === 200){
            toast("SESSION IS BEING RESTORED", {

                closeButton: () => {
                    setTimeout(function(){
                        window.location.reload()
                    }, 2000);
                },
                autoClose: 1000

            });
            return response;
        }

        if(response.status === 403 || response.status === 401){
            const userDetails = JSON.parse(sessionStorage.getItem("login-details"));
            id = userDetails.id;
            logout({id}).then(data => {
                sessionStorage.clear();
                localStorage.clear();
                window.location.href = "/login";
                return data;
            }).catch(error => console.log(error));

        }

    })
        .catch(error => {
            console.log(error);
        });
};
