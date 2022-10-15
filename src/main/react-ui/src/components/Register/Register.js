import '../Form/Form.scss';
import FormInput from "../Form/FormInput";
import SwitchCheckbox from "../../main-ui/SwitchCheckbox";
import FormButton from "../Form/FormButton";
import {createUser} from "../../services/UserService";
import {Fragment, useEffect, useRef, useState} from "react";
import Alert from "../Alert/Alert";
import Icon from "../../Icon";
import {number} from "prop-types";
import LoaderSpinner from "../../main-ui/LoaderSpinner";


function Register() {

    const [user, setUser] = useState({
        email: "",
        firstName: "",
        lastName: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [responseStatus, setResponseStatus] = useState(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setUser({
            ...user,
            [e.target.name]: value
        });
    }


    const handleRegistration = (e) => {
        e.preventDefault();
        setLoading(true);

        if ((user.email || user.password || user.firstName || user.lastName) === ""){
            setResponseStatus(500);
            setLoading(false);
            return;
        }
        createUser(user).then((response) => {

            console.log(response.ok);
            if (response.ok) {
                setResponseStatus(200);
                window.location.href = "/login";

            } else {
                setResponseStatus(response.status);
            }





        });
        setLoading(false);
    }

    return (
        <Fragment>
            {loading && <LoaderSpinner/>}

            <div className="form_container">
                <h3>REGISTER</h3>
                <div className="form_wrapper">
                    <form onSubmit={handleRegistration}>

                        {responseStatus === 500 && <Alert backgroundColor="orange" title="WARNING"
                                                          text="All fields must be fulfilled, try again"
                                                          iconName="warning"/>}

                        <FormInput name="email"
                                   id="register_email"
                                   handleChange={handleChange}
                                   type="email"
                                   iconName="envelop"
                                   label="Email"/>

                        <FormInput name="firstName"
                                   id="register_firstName"
                                   handleChange={handleChange}
                                   type="text"
                                   iconName="person"
                                   label="First Name"/>

                        <FormInput name="lastName"
                                   id="register_lastName"
                                   handleChange={handleChange}
                                   type="text"
                                   iconName="person"
                                   label="Last Name"/>

                        <FormInput name="password"
                                   id="register_password"
                                   handleChange={handleChange}
                                   type="password"
                                   iconName="key"
                                   label="Password"/>
                        <FormButton id="" label="register"/>
                    </form>
                </div>
            </div>
        </Fragment>
    );
}

export default Register;
