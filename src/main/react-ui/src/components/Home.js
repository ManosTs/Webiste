import './Home.scss';
import {Fragment, useEffect, useState} from "react";
import {retrieveUsers} from "../services/serviceApi";
import UserList from "./UserList";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser} from "../actions/userActions";
import Countdown from 'react-countdown';
import {ToastContainer} from "react-toastify";

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
        let id = loggedUser.id;
        await retrieveUsers({page, size, id})
            .then(data => setUsers(data))
            .catch(error => console.log(error));
    };
    const getLoggedUserDetails = () => {
        const userDetails = JSON.parse(sessionStorage.getItem("login-details"));
        setLoggedUser({
            username:userDetails.username,
            id:userDetails.id,
            email:userDetails.email,
            roleName: userDetails.roles[0].name

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
        <Fragment>
        <div className="home--wrapper">
            <div className="user-info--card">
                <h2>USER INFO</h2>
                <p>{loggedUser.username}</p>
                <p>{loggedUser.email}</p>
                <p>{loggedUser.roleName === "ROLE_USER" ? "USER" : ""}</p>
                <button onClick={logoutHandler}>LOGOUT</button>
            </div>
            <div className="expiration--card">
                <div className="expires">
                    <p>USER TOKEN EXPIRES IN</p>
                    <Countdown date={Date.now() + 60 * 1000} />
                </div>

                <div className="expires">
                    <p>USER REFRESH TOKEN EXPIRES IN</p>
                    <Countdown date={Date.now() + 8000000 * 1000} />
                </div>


            </div>

            <UserList retrieveAsyncUsers={retrieveAsyncUsers} users={users} totalElements={users?.totalElements}/>
            <ToastContainer  />
        </div>
        </Fragment>
    );
}

export default Home;