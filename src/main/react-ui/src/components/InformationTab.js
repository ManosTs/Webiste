import "./InformationTab.scss";
import BuildIcon from "@mui/icons-material/Build";
import {useEffect, useState} from "react";



function InformationTab () {
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
        <div className="information--tab">
            <div className="information--tab__info">
                <p>Full name</p>
                <p>{loggedUser.firstName + " " + loggedUser.lastName}</p>
                <button type="button" className="information--tab__updateProfile">
                    <BuildIcon />
                    <p>Update</p>
                </button>
            </div>

            <div className="information--tab__info">
                <p>Email</p>
                <p>{loggedUser.email}</p>
                <button type="button" className="information--tab__updateProfile">
                    <BuildIcon />
                    <p>Update</p>
                </button>
            </div>

            <div className="information--tab__info">
                <p>Username</p>
                <p>{loggedUser.username}</p>
                <button type="button" className="information--tab__updateProfile">
                    <BuildIcon />
                    <p>Update</p>

                </button>
            </div>

            <div className="information--tab__info">
                <p>Birth date</p>
                <p>{loggedUser.birthDate}</p>
                <button type="button" className="information--tab__updateProfile">
                    <BuildIcon />
                    <p>Update</p>

                </button>
            </div>

            <div className="information--tab__info">
                <p>Gender</p>
                <p>{loggedUser.gender}</p>
                <button type="button" className="information--tab__updateProfile">
                    <BuildIcon />
                    <p>Update</p>

                </button>
            </div>

        </div>
    );
}


export default InformationTab;