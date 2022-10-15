import '../Form/Form.scss';
import FormInput from "../Form/FormInput";
import SwitchCheckbox from "../../main-ui/SwitchCheckbox";
import FormButton from "../Form/FormButton";
import Alert from "../Alert/Alert";
import {Fragment, useState} from "react";
import {authUser} from "../../services/UserService";
import LoaderSpinner from "../../main-ui/LoaderSpinner";
import Cookies from 'js-cookie';

function Login() {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [responseStatus, setResponseStatus] = useState(null);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setUser({
            ...user,
            [e.target.name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        authUser(user).then(async (response) => {
            if (response.status === 200) {
                handleModal();
                let data = await response.json();
                Cookies.set("token", "21341");
                Cookies.set("id", data.id);
            } else {
                setResponseStatus(response.status);
            }

            setLoading(false);
        });
    }

    const handleModal = () => {
        window.location.href = "/home";
    };
    return (
        <Fragment>
            {loading && <LoaderSpinner/>}
            <div className="form_container">

                <h3>LOGIN</h3>
                <div className="form_wrapper">
                    <div className="form_avatar">
                        <img/>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {responseStatus === 403 &&
                        <Alert backgroundColor="red" title="ERROR" text="Sorry, Access Denied :( !"
                               iconName="error"/>}
                        {responseStatus === 404 &&
                        <Alert backgroundColor="orange" title="WARNING" text="User not found!"
                               iconName="error"/>}
                        <FormInput name="email"
                                   id="login_email"
                                   handleChange={handleChange}
                                   type="email"
                                   iconName="envelop"
                                   label="Email"/>

                        <FormInput name="password"
                                   id="login_password"
                                   handleChange={handleChange}
                                   type="password"
                                   iconName="key"
                                   label="Password"/>
                        <SwitchCheckbox label="Remember Me" id="login_rememberMe"/>
                        <FormButton id="" label="login"/>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default Login;
