import "./Layout.scss";
import {NavLink, Outlet} from "react-router-dom";
import "./Profile.scss";
import {useEffect, useState} from "react";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import BuildIcon from '@mui/icons-material/Build';
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
            firstName:userDetails.firstName,
            lastName: userDetails.lastName,
            gender: userDetails.gender,
            birthDate: userDetails.birthDate,
            roleName: userDetails.roles[0].name

        });
    };

    return(
        <div className="profile-grid">
            {/*<div className="profile--settings">*/}
            {/*    <h2>Settings</h2>*/}
            {/*</div>*/}
            <div className="profile--wrapper">
                <div className="profile--wrapper__media">
                    <img alt="" className="profile--wrapper__image"></img>
                    <img alt="" className="profile--wrapper__backgroundImage"></img>
                </div>
                <div className="profile--wrapper__info">
                    <div className="profile--wrapper__infoItem update-profile">


                    </div>
                    <div className="profile--wrapper__infoItem user-info">
                        <div className="profile--wrapper__username">{loggedUser.firstName + " " + loggedUser.lastName}</div>
                    </div>

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
                        <li><NavLink to={'posts'}>POSTS</NavLink></li>
                        <li><NavLink to={'friends'}>FRIENDS</NavLink></li>
                        <li><NavLink to={'information'}>INFORMATION</NavLink></li>
                    </ul>
                </div>

                <Outlet />
            </div>

        </div>

    );
}


export default Profile;