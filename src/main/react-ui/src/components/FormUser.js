import * as api from '../services/serviceApi.js';
import {useEffect, useRef, useState} from "react";
import './FormUser.scss';
import LoaderSpinner from "./LoaderSpinner";
import {NavLink} from "react-router-dom";

function FormUser({title, hideUsernameField, login}) {
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const emailRef = useRef('');
    const [dataUser, setDataUser] = useState({});
    const [enableSpinner, setEnableSpinner] = useState(false);

    const handleOnChangeEvent = () => {
        setDataUser({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            email: emailRef.current.value
        });
    };

    const handleLoginSubmit = (e) => {
        setEnableSpinner(true);
        e.preventDefault();

        console.log(dataUser);
        api.loginUser(dataUser)
            .then(data => {
                console.log(data);
                setEnableSpinner(false);
            })
            .catch(error => {
                console.log(error);
                setEnableSpinner(false);
            });
    };

    const handleRegisterSubmit = (e) => {
        setEnableSpinner(true);
        e.preventDefault();

        console.log(dataUser);
        api.addUser(dataUser)
            .then(data => {
                console.log(data);

                setEnableSpinner(false);
            })
            .catch(error => {
                console.log(error);
                setEnableSpinner(false);
            });
    };

    // useEffect(() => {
    //
    // }, [])
    return (
        <div className="addUser--wrapper">
            <form className="addUser--wrapper__form"  onSubmit={login === false ? handleRegisterSubmit : handleLoginSubmit}>
                {hideUsernameField === false &&
                    <input
                    ref={usernameRef}
                    type="text"
                    id="username"
                    name="username"
                    className="addUser--wrapper__input"
                    placeholder="Username"
                    onChange={handleOnChangeEvent}
                />}
                <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    name="email"
                    className="addUser--wrapper__input"
                    placeholder="Email"
                    onChange={handleOnChangeEvent}
                />

                <input
                    ref={passwordRef}
                    type="password"
                    id="password"
                    name="password"
                    className="addUser--wrapper__input"
                    placeholder="Password"
                    onChange={handleOnChangeEvent}
                />
                {login === true && <NavLink to="/register" className="addUser--wrapper__registerMsg">No account? Register Now</NavLink>}
                <button className="addUser--wrapper__button" type="submit">SUBMIT</button>
            </form>
            <p className="addUser--wrapper__title">{title}</p>

            {enableSpinner && <LoaderSpinner />}
        </div>
    );
}

export default FormUser;