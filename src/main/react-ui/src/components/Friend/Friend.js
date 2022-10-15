import './Friend.scss';
import ProfByline from "../ProfByline/ProfByline";
import {Fragment, useEffect, useState} from "react";
import Chat from "../Chat/Chat";
import Icon from "../../Icon";
import {getFriends} from "../../services/FriendService";
import Cookies from "js-cookie";
function Friend(props) {
    const [openChat, setOpenChat] = useState(false);
    const [openMobileFriends, setOpenMobileFriends] = useState(false);
    const [friendList, setFriendList] = useState([]);

    const handleOpenChat = () => {
        setOpenChat(!openChat);
    };

    const showSideMenuOnMobile = () => {
        setOpenMobileFriends(!openMobileFriends);
    };

    useEffect(() => {
        getFriends(Cookies.get("id")).then(async (response) => {
            let data = await response.json();
            setFriendList(data);
        });
    }, []);



    return (
        <Fragment>
            <div className="friend--container"
            style={{
                top: openMobileFriends && window.innerWidth < 1024 ? '0' : 'calc(100% - 40px)',
                width: openMobileFriends && window.innerWidth < 1024 ? '100%' : '50%',
                zIndex: openMobileFriends && window.innerWidth < 1024 ? '999999999' : '1'
            }}
            >
                <div onClick={showSideMenuOnMobile} className="friend--container__actionWrapper">
                    <h2 className="friend--container__title">Friends</h2>
                    <button
                         className="friend--container__headAction">
                        <Icon name="people" size={43} color="#1D1E2C" />

                    </button>
                </div>
                <div className="friend--container__profWrapper">
                    {friendList.length > 0 ? friendList.map(
                        (value, index, array) =>
                            (<span key={value.id}><ProfByline id={value.id}
                                               text={""}
                                               userName={value.firstName + " " +value.lastName} /></span>)
                    ) : "No friends"}
                </div>

            </div>
            {openChat && <Chat closeChat={handleOpenChat}/>}
        </Fragment>
    );
}




export default Friend;
