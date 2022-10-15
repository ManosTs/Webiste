
import './Home.scss';
import {Fragment} from "react";
import Friend from "../Friend/Friend";
import Post from "../Post/Post";
import Menu from "../Menu/Menu";
import MobileChat from "../Chat/MobileChat";
function Home() {
    return(
        <div className="home--container">
            <Friend />
            <MobileChat />
            <Post />
            <Menu />
        </div>
    );
}

export default Home;
