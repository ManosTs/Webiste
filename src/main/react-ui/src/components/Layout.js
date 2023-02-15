import {Fragment, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, refreshUser} from "../actions/userActions";
import {refreshToken, retrieveUsers} from "../services/serviceApi";
import "./Layout.scss";
import Countdown from "react-countdown";
import React from "react";
function Layout({children}){
    const [loggedUser, setLoggedUser] = useState({});
    const history = useNavigate();
    const {loading, error, results, success, actionType} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const logoutHandler = () => {
        let id = loggedUser.id;
        dispatch(logoutUser({id}));
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

    const refreshAccess = () => {
        let id = loggedUser.id;
        dispatch(refreshUser(id));
    };
    const CountDownWrapper = () => <Countdown onComplete={refreshAccess} date={Date.now() + 60 * 1000} />;
    const MemoCountDown = React.memo(CountDownWrapper);
    useEffect(() => {
        getLoggedUserDetails();
    }, []);

    useEffect(() => {
        if(success && actionType === 'user/logout/fulfilled'){
            sessionStorage.clear();
            localStorage.clear();
            history('/login');
        }

        if(success && actionType === 'user/refresh-token'){

            // window.location.reload();
        }
    }, [success, error]);

    return(
        <Fragment>
            <header>
                <div className="header--container">
                    <NavLink to={'/'} className="header--container__logo">LOGO</NavLink>
                    <div className="header--user-info--card">
                        <div className="user-info">
                            <p>{loggedUser.username}</p>
                            <p>{loggedUser.email}</p>
                        </div>
                        {/*<p>{loggedUser.roleName === "ROLE_USER" ? "USER" : ""}</p>*/}

                    </div>
                    <div className="header--container__links">
                        <NavLink to={'/profile'} className="header--container__link">My Profile</NavLink>
                        <NavLink to={'/settings'} className="header--container__link">Settings</NavLink>
                        <NavLink to={'/users'} className="header--container__link">Users</NavLink>
                    </div>
                    <div className="header--container__search">
                        <input type="text" placeholder="Search for People" id="searchHeader"/>
                    </div>

                    <div className="header--container__sessionTime">
                        <MemoCountDown />
                    </div>
                    <button onClick={logoutHandler}>LOGOUT</button>
                </div>
            </header>
            <main>{children}</main>
            <footer>
                <div className="footer--container">

                </div>
            </footer>

        </Fragment>
    )
}


export default Layout;