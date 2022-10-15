import './Header.scss';
import {NavLink} from "react-router-dom";
import Cookies from 'js-cookie';
import FormInput from "../components/Form/FormInput";
import Icon from "../Icon";
import {Fragment, useEffect, useState} from "react";
import HeaderMobileMenu from "./HeaderMobileMenu";
import SearchHeaderMenu from "./SearchHeaderMenu";
import {getUserInfoById} from "../services/UserService";
import {getFriends} from "../services/FriendService";

export const Header = () => {

    const token = Cookies.get("token");
    const id = Cookies.get("id");
    const [mobileMenu, setMobileMenu] = useState(false);

    const logout = () => {
        Cookies.remove("token");
        window.location.reload();
    }

    const handleSearchChange = () => {
    };

    const handleMobileMenu = () => {
        setMobileMenu(!mobileMenu);
    };
    const [profileImage, setProfileImage] = useState();
    useEffect(() => {
        getUserInfoById(id).then(async (response) => {
            let data = await response.json();
            setProfileImage(data.profileImg);
        });


    }, []);
    return (
        <Fragment>
            <header className="app_header">
                <nav>
                    <div className="header_logo">
                        <NavLink
                            to="home"
                        >
                            LOGO
                        </NavLink>
                    </div>

                    {token &&
                        <SearchHeaderMenu handleSearchChange={handleSearchChange}/>
                    }

                    <div className="header_actions">
                        {!token &&
                        <NavLink
                            to="login"
                            className={({isActive}) =>
                                isActive ? "activeLink" : undefined
                            }
                        >
                            LOGIN
                        </NavLink>}

                        {!token &&
                        <NavLink
                            to="register"
                            className={({isActive}) =>
                                isActive ? "activeLink" : undefined
                            }
                        >
                            REGISTER
                        </NavLink>}

                        {token &&
                        <NavLink
                            id="header_profile"
                            to={`/profile/${id}`}
                            className={({isActive}) =>
                                isActive ? "activeLink header-actions__logged" : "header-actions__logged"
                            }
                        >
                            {profileImage ? <img id="header_profile_backgroundImg"
                                                 src={`data:image/png;base64,${profileImage}`}
                                                 alt="header-profile-img"/> : <img/>}
                        </NavLink>}

                        {token &&
                        <NavLink
                            to="login"
                            onClick={logout}
                            className="header-actions__logged"
                        >
                            <Icon name="logout" color="#1C0118" size={25}/>
                        </NavLink>}

                        {token &&
                        <div onClick={handleMobileMenu} className={mobileMenu ? "center openedMenu" : "center"}>
                            <div></div>
                        </div>
                        }
                    </div>
                </nav>
            </header>
            {mobileMenu && <HeaderMobileMenu id={id} token={token} logout={logout}/>}
        </Fragment>
    );
}
