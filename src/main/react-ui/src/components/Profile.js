import "./Layout.scss";
import {NavLink, Outlet} from "react-router-dom";
import "./Profile.scss";
import {useEffect, useState} from "react";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
                <h2>Settings</h2>
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
                <div className="profile--wrapper__actions">
                    <button type="button" className="profile--wrapper__action add-friend">
                        <AddIcon />
                        <p>ADD FRIEND</p>
                    </button>
                    <button type="button" className="profile--wrapper__action delete-friend">
                        <RemoveIcon />
                        <p>DELETE</p>
                    </button>
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
            <div className="profile--friends">
                <h2>Friends</h2>
                <div className="profile--friends__innerWrapper">
                    <ul>
                        <li>
                            <a href="#" className="profile--friends__info">
                                <div className="profile--friends__imageWrapper">
                                    <img alt="" className="profile--friends__profileImage"/>
                                    <span className="friend--active--icon">
                                        <FiberManualRecordIcon />
                                    </span>
                                </div>
                                <p className="profile--friends__friendName">FRIEND NAME 1</p>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="profile--friends__info">
                                <div className="profile--friends__imageWrapper">
                                    <img alt="" className="profile--friends__profileImage"/>
                                    <span className="friend--active--icon">
                                        <FiberManualRecordIcon />
                                    </span>
                                </div>
                                <p className="profile--friends__friendName">FRIEND NAME 2</p>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    );
}


export default Profile;