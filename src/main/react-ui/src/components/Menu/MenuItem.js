import Icon from "../../Icon";
import "./MenuItem.scss";

function MenuItem ({iconName, text, onClick}) {
    return(
        <div onClick={onClick} className="menuItem--container">
            <div className="menuItem--container__wrapper">
                <Icon name={iconName} color="#1D1E2C" size={17}/>
                <p>{text}</p>
            </div>

        </div>
    );
}

export default MenuItem;
