import "./MobileChat.scss";
import {useEffect, useState} from "react";
import Icon from "../../Icon";
import ProfByline from "../ProfByline/ProfByline";
import {getAllUsers} from "../../services/UserService";

function MobileChat() {
    const [openMobileMessages, setOpenMobileMessages] = useState(false);
    let users;
    const showMessagesMenuOnMobile = () => {
        setOpenMobileMessages(!openMobileMessages);
    };

    useEffect(() => {
        users = getAllUsers();
    }, []);
    return(
        <div className="mobileChat--container" style={{
            top: openMobileMessages && window.innerWidth < 1024 ? '0' : 'calc(100% - 40px)',
            width: openMobileMessages && window.innerWidth < 1024 ? '100%' : '50%',
            zIndex: openMobileMessages && window.innerWidth < 1024 ? '999999999' : '1'
        }}>
            <div onClick={showMessagesMenuOnMobile} className="mobileChat--container__actionWrapper">
                <h2 className="mobileChat--container__title">Messages</h2>
                <button className="mobileChat--container__headAction">
                    <Icon name="message" size={43} color="#1D1E2C" />
                    <span></span>
                </button>
            </div>
            <div className="mobileChat--container__mesgWrapper">
                <div className="mobileChat--mesgWrapper__onlineFriends">
                    <ProfByline />
                    <ProfByline />
                    <ProfByline />
                </div>
                <div className="mobileChat--mesgWrapper__lastMsgs">

                </div>


            </div>
        </div>
    );
}

export default MobileChat;
