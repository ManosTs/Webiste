import './FriendsTab.scss';
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";




function FriendsTab () {
    return(
        <div className="profile--friends">
            {/*<h2>FriendsTab</h2>*/}
            <div className="profile--friends__innerWrapper">
                <ul>
                    <li>
                        <a href="../.#" className="profile--friends__info">
                            <div className="profile--friends__imageWrapper">
                                <img alt="" className="profile--friends__profileImage"/>
                                <span className="friend--active--icon">
                                        <FiberManualRecordIcon />
                                    </span>
                            </div>
                            <p className="profile--friends__friendName">FRIEND NAME 1</p>
                        </a>
                    </li>
                    <li>
                        <a href="../.#" className="profile--friends__info">
                            <div className="profile--friends__imageWrapper">
                                <img alt="" className="profile--friends__profileImage"/>
                                <span className="friend--active--icon">
                                        <FiberManualRecordIcon />
                                    </span>
                            </div>
                            <p className="profile--friends__friendName">FRIEND NAME 2</p>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default FriendsTab;