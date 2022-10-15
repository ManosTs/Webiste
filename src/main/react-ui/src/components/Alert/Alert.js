
import './Alert.scss';
import Icon from "../../Icon";
import {Fragment, useState} from "react";
function Alert({title, text, iconName, backgroundColor,buttonText}) {
    const [showAlert, setShowAlert] = useState(true);

    const handleModal = () => {
        setShowAlert(!showAlert);
        window.location.reload();
    };

    return(
        <Fragment>
            {showAlert &&
                <div className="alert_container" style={{backgroundColor: backgroundColor}}>
                    <div className="alert_head">
                        <Icon name={iconName} color="#ffffff" size={30}/>
                        <p>{title}</p>
                    </div>
                    <div className="alert_body">
                        <p>{text}</p>
                    </div>
                    <div className="alert_actions">
                        <button onClick={handleModal} type="button">{buttonText ? buttonText : "CANCEL"}</button>
                    </div>
                </div>
            }
        </Fragment>
    );
}

export default Alert;
