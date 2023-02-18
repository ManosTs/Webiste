import {Fragment, useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {logoutUser, refreshUser} from "../actions/userActions";
import "./Layout.scss";
import Countdown from "react-countdown";
import React from "react";
import {ToastContainer} from "react-toastify";
// import SearchIcon from '@mui/icons-material/Search';
function Layout({memoCountdown,children}){
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
        // dispatch(refreshUser(id));
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

        if(success && actionType === 'user/refresh-token'){

            // window.location.reload();
        }
    }, [success, error]);

    return(
        <Fragment>
            <header>
                <div className="header--container">
                    <NavLink to={'/'} className="header--container__logo">LOGO</NavLink>
                    <div className="header--container__links">
                        <NavLink to={`/profile/${loggedUser.id}`}
                                 className="header--container__link">{loggedUser.username}</NavLink>
                        {/*<NavLink to={'/settings'} className="header--container__link">Settings</NavLink>*/}
                        <NavLink to={'/discover'}
                                 className="header--container__link">Discover</NavLink>
                    </div>
                    {/*<div className="header--container__search">*/}
                    {/*    <SearchIcon/>*/}
                    {/*    <input type="text" placeholder="Search for People" id="searchHeader"/>*/}
                    {/*</div>*/}

                    <div className="header--container__sessionTime">
                        {memoCountdown}
                    </div>
                    <button onClick={logoutHandler}>LOGOUT</button>
                </div>
            </header>
            <main className="main-page">{children}</main>
            <footer>
                <div className="footer--container">

                </div>
            </footer>
            <ToastContainer  />
        </Fragment>
    )
}


export default Layout;