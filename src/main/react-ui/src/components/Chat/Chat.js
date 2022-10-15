import './Chat.scss';
import ProfByline from "../ProfByline/ProfByline";
import FormInput from "../Form/FormInput";
import Icon from "../../Icon";
import {useState} from "react";


function Chat({closeChat}) {
    const [message, setMessage] = useState([]);

    let showMessage;
    const handleMessage = (e) => {
        showMessage = e.target.value;
    };
    const onClickShowMessage = (e) => {
        if(showMessage === undefined){
            return;
        }
        setMessage([...message, showMessage]);
    };


    return(
        <div className="chat--container">
            <div className="chat--container__head">
                <ProfByline />
            </div>
            <div className="chat--container__body">
                {message. map(val => <div className="chat--container__message">
                    {val}
                </div>)}
                <div className="chat--container__actionWrapper">
                    <FormInput name="text"
                               id="chat_text"
                               type="text"
                               placeholder="Type a message..."
                               autoComplete="off"
                               handleChange={handleMessage}
                    />
                    <button onClick={onClickShowMessage} className="chat--container__sendButton">
                        <Icon name="send" size={43} color="#a6a5a5" />
                    </button>

                </div>

            </div>
        </div>
    );

}

export default Chat;
