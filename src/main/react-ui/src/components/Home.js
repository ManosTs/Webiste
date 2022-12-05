import './Home.scss';
import {useEffect, useState} from "react";
import {retrieveUsers} from "../services/serviceApi";
import UserList from "./UserList";

function Home() {
    const [users, setUsers] = useState(null);
    const [loggedUser, setLoggedUser] = useState({});

    const retrieveAsyncUsers = async (page) => {
        let size = 5;
        await retrieveUsers({page, size})
            .then(data => setUsers(data))
            .catch(error => console.log(error));
    };
    const getLoggedUserDetails = () => {
        const userDetails = JSON.parse(sessionStorage.getItem("login-details"));
        setLoggedUser({
            username:userDetails.username,
            id:userDetails.id,
            email:userDetails.email,

        });
    };

    useEffect(() => {
        retrieveAsyncUsers(1);
        getLoggedUserDetails();

    }, []);



    return (
        <div className="home--wrapper">
            <p>{loggedUser.username}</p>
            <p>{loggedUser.email}</p>
            <UserList retrieveAsyncUsers={retrieveAsyncUsers} users={users} totalElements={users?.totalElements}/>
        </div>
    );
}

export default Home;