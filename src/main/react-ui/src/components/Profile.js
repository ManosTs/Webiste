import "./Layout.scss";
import {NavLink, Outlet} from "react-router-dom";
import "./Profile.scss";
import {useEffect, useState} from "react";

function Profile(){
    const [loggedUser, setLoggedUser] = useState({});

    useEffect(() => {
        getLoggedUserDetails();
    }, []);
    const getLoggedUserDetails = () => {
        const userDetails = JSON.parse(sessionStorage.getItem("login-details"));
        setLoggedUser({
            username:userDetails.username,
            id:userDetails.id,
            email:userDetails.email,
            roleName: userDetails.roles[0].name

        });
    };

    return(
        <div className="profile-grid">
            <div className="profile--settings">

            </div>
            <div className="profile--wrapper">
                <div className="profile--wrapper__media">
                    <img alt="" className="profile--wrapper__image"></img>
                    <img alt="" className="profile--wrapper__backgroundImage"></img>
                </div>
                <div className="profile--wrapper__info">
                    <div className="profile--wrapper__username">{loggedUser.username}</div>
                    <div className="profile--wrapper__email">{loggedUser.email}</div>
                </div>

                <div className="profile--wrapper__tabs">
                    <ul>
                        <li><NavLink to={'tab1'}>TAB 1</NavLink></li>
                        <li><NavLink to={'tab2'}>TAB 2</NavLink></li>
                        <li><NavLink to={'tab3'}>TAB 3</NavLink></li>
                    </ul>
                </div>
                <Outlet />
            </div>
            <div className="profile--settings">

            </div>
        </div>

    );
}


export default Profile;