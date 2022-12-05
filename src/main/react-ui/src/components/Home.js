import './Home.scss';
import {useEffect, useState} from "react";
import {logout, retrieveUsers} from "../services/serviceApi";
import UserList from "./UserList";
import jsCookie from "js-cookie";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../actions/userActions";

function Home() {
    const [users, setUsers] = useState(null);
    const [loggedUser, setLoggedUser] = useState({});
    const history = useNavigate();
    const {loading, error, results, success, actionType} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const logoutHandler = () => {
        let id = loggedUser.id;
        dispatch(logoutUser({id}));



    };

    const retrieveAsyncUsers = async (page) => {
        let size = 6;
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

    useEffect(() => {
        if(success && actionType === 'user/logout/fulfilled'){
            sessionStorage.clear();
            localStorage.clear();
            history('/login');
        }
    }, [success, error]);



    return (
        <div className="home--wrapper">
            <div className="user-info--card">
                <h2>USER INFO</h2>
                <p>{loggedUser.username}</p>
                <p>{loggedUser.email}</p>
                <button onClick={logoutHandler}>LOGOUT</button>
            </div>

            <UserList retrieveAsyncUsers={retrieveAsyncUsers} users={users} totalElements={users?.totalElements}/>
        </div>
    );
}

export default Home;