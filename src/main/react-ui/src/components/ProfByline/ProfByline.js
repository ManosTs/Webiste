import "./ProfByline.scss";
import {useEffect, useState} from "react";
import {getUserInfoById} from "../../services/UserService";
import Icon from "../../Icon";

function ProfByline({id, userName, text}) {

    const goToProfile = () => {
        window.location.href = "/profile/" + id;
    };

    const [profileImage, setProfileImage] = useState();
    useEffect(() => {
        if(id !== undefined){
            getUserInfoById(id).then(async (response) => {
                let data = await response.json();
                setProfileImage(data.profileImg);
            });
        }



    });

    return(
        <div key={id} onClick={goToProfile} className="profileByline--itemContainer">
            <div
                 className="profileByline--itemContainer__img">
                {profileImage ? <img id="headerSearch_profile_backgroundImg"
                                     src={`data:image/png;base64,${profileImage}`}
                                     alt="header-profile-img"/> : <img/>}
            </div>

            <div className="profileByline--itemContainer__info">
                <p>{userName}</p>
                {text !== "" && <p>text</p>}
            </div>
        </div>
    );
}

export default ProfByline;
