import './Menu.scss';
import MenuItem from "./MenuItem";
import {Fragment, useState} from "react";
import CreatePost from "../Post/CreatePost";
import Icon from "../../Icon";


function Menu(props) {
    const [showItems, setShowItems] = useState(false);

    const [showCreatePost, setShowCreatePost] = useState(false);

    const [openMobileSideMenu, setOpenMobileSideMenu] = useState(false);

    const showSideMenuOnMobile = () => {
        setShowItems(true);
        setOpenMobileSideMenu(!openMobileSideMenu);

    };
    const handleShowItems = () => {

      setShowItems(!showItems);
    };

    const handleCreatePost = () => {
        setShowCreatePost(!showCreatePost);
    };

    return (
        <Fragment>
            <div className="menu--container"
                 style={{
                     right: openMobileSideMenu ? '0' : '-201px',
                 }}
            >
                <div className="menu--container__actionWrapper">
                    <h2 onClick={handleShowItems} className="menu--container__title">Menu</h2>
                    <button
                        style={{
                            top: openMobileSideMenu ? '-15px' : '0',
                            left: openMobileSideMenu ? '-30px' : '-46px',
                        }}
                        onClick={showSideMenuOnMobile} className="menu--container__headAction">
                        <Icon name="grid-gap" size={43} color="#a6a5a5" />
                    </button>
                </div>
                {showItems &&
                <div style={{
                    right: openMobileSideMenu ? '0' : '-201px',
                    opacity: openMobileSideMenu ? '1' : '0.6'
                }} className="menu--container__items">
                    <MenuItem iconName="plus" text="Create a post" onClick={handleCreatePost}/>
                    <MenuItem iconName="settings-gear" text="Settings" onClick={handleCreatePost}/>
                </div>}
            </div>

        </Fragment>
    );
}

export default Menu;
