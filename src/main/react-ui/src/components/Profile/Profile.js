import './Profile.scss';
import Icon from "../../Icon";
import {Fragment, useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {addFriend, getFriends} from "../../services/FriendService";
import Cookies from "js-cookie";
import UploadImage from "../UploadImage/UploadImage";
import default_profile from "../../resources/images/default_profile.png";
import {getUserInfoById} from "../../services/UserService";
import data from "bootstrap/js/src/dom/data";
import PropTypes from "prop-types";

function Profile() {
    const [friend, setFriend] = useState({
        friendId: "",
        userId: ""
    });



    const [profileImage, setProfileImage] = useState();
    const [backgroundImage, setBackgroundImage] = useState();
    const [dataToRetrieve, setDataToRetrieve] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        profileImg: "",
        backgroundImg: "",

    });
    const [imageKind, setImageKind] = useState("");
    const [toggleUpload, setToggleUpload] = useState(false);


    const toggleUploadImage = (e) => {
        setImageKind(e.target.getAttribute('data-imageKind'));
        setToggleUpload(!toggleUpload);


    };

    let {id} = useParams();

    const handleAddFriendOnClick = () => {
        setFriend({
            friendId: id,
            userId: Cookies.get("id")
        });

        if ((friend.friendId || friend.userId) === "") {
            return;
        }
        addFriend(friend).then((response) => {
            console.log(response);
        });
    };


    useEffect(() => {
        getUserInfoById(id).then(async (response) => {
            let data = await response.json();
            setDataToRetrieve({
                userId: data.userId,
                firstName: data.firstName,
                lastName: data.lastName,
                profileImg: data.profileImg,
                backgroundImg: data.backgroundImg
            });

        });


        getFriends(Cookies.get("id")).then(async (response) => {
            let data = await response.json();

            for (let i = 0; i < data.length; i++) {
                if (id === data[i].id) {

                } else {
                    // addFriendButton =
                    // <button
                    //     type="button" className="profile--settingsBar__action">
                    //     Remove
                    // </button>;
                }

            }

        });


    }, [id, dataToRetrieve]);

    const name = dataToRetrieve.firstName !== "" ? (dataToRetrieve.firstName + " " + dataToRetrieve.lastName) : "UNKNOWN"
    return (
        <Fragment>
            {toggleUpload && <UploadImage close={toggleUploadImage} imageKind={imageKind}/>}
            <div className="profile--container">
                <div className="profile--container__media">
                    <img
                        src={dataToRetrieve.profileImg ? `data:image/png;base64,${dataToRetrieve.profileImg}` : default_profile}
                        id="profile_avatar" alt="profImage"
                        onClick={toggleUploadImage}
                        data-imagekind="profileImg"/>

                    {!dataToRetrieve.backgroundImg &&
                    <div id="profile_backgroundImg"
                         onClick={toggleUploadImage}
                         data-imagekind="backgroundImg"/>
                    }
                    {dataToRetrieve.backgroundImg &&
                    <img id="profile_backgroundImg"
                         src={`data:image/png;base64,${dataToRetrieve.backgroundImg}`}
                         alt="backgroundImage"
                         onClick={toggleUploadImage}
                         data-imagekind="backgroundImg"/>
                    }

                </div>
                <div className="profile--infoUser">
                    <p className="profile--infoUser__name">
                        {name}
                    </p>
                </div>
                <div className="profile--container__settingsBar">
                    <button type="button" onClick={handleAddFriendOnClick} className="profile--settingsBar__action">
                        <Icon name="plus" size={20} color="#1C0118"/>
                        <p>Add Friend</p>
                    </button>
                </div>
                <div className="profile--container__posts">

                </div>
            </div>
        </Fragment>
    );
}

export default Profile;
