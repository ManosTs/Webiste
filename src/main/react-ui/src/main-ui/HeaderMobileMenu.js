import "./HeaderMobileMenu.scss";
import {NavLink} from "react-router-dom";
import Icon from "../Icon";
import {useEffect, useState} from "react";
import {getUserInfoById} from "../services/UserService";

function HeaderMobileMenu ({id, token, logout}){
    const [profileImage, setProfileImage] = useState();
    useEffect(() => {
        getUserInfoById(id).then(async (response) => {
            let data = await response.json();
            setProfileImage(data.profileImg);
        });


    }, []);
    return(
      <div className="headerMobileMenu--container">
          {token &&
          <a
              href={`/profile/${id}`}
              className="header-actions__logged"
          >
              {profileImage ? <img id="headerMobile_profile_backgroundImg"
                                   src={`data:image/png;base64,${profileImage}`}
                                   alt="header-profile-img"/> : <Icon name="profile" color="#1C0118" size={25} /> } PROFILE
          </a>}

          {token &&
          <NavLink
              to="login"
              onClick={logout}
          >
              <Icon name="logout" color="#1C0118" size={25} /> LOGOUT
          </NavLink>}
      </div>
    );
}
export default HeaderMobileMenu;
