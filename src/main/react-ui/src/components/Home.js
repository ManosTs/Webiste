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

            {/*<div className="expiration--card">*/}


            {/*    <div className="expires">*/}
            {/*        <p>USER REFRESH TOKEN EXPIRES IN</p>*/}
            {/*        <Countdown date={Date.now() + 9000000 * 1000} />*/}
            {/*    </div>*/}
            {/*</div>*/}


        </div>
    );
}

export default Home;