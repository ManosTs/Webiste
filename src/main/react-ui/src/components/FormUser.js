import * as api from '../services/serviceApi.js';
import {Fragment, useEffect, useRef, useState} from "react";
import './FormUser.scss';
import LoaderSpinner from "./LoaderSpinner";
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authUser, registerUser} from "../actions/userActions";
import {loginUser} from "../services/serviceApi.js";

function FormUser({title, hideUsernameField, login}) {
    const usernameRef = useRef('');
    const passwordRef = useRef('');
    const emailRef = useRef('');
    const [dataUser, setDataUser] = useState({});
    const [errors, setErrors] = useState({});
    let history = useNavigate();

    const {loading, error, results, success, statusCode} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const handleOnChangeEvent = () => {
        setDataUser({
            username: usernameRef.current.value,
            password: passwordRef.current.value,
            email: emailRef.current.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();


        if (login) {

            dispatch(authUser(dataUser));


        }

        if (!login) {
            dispatch(registerUser(dataUser));
        }


    };

    useEffect(() => {
        console.log(success);
        if (login && success) {
            sessionStorage.setItem("login-details", JSON.stringify(results));
            setErrors({});
            window.location.href = '/';
        }

        if (success && !login) {
            window.location.href = '/login';

        }

        if (!success) {
            setErrors(error);
        }
    }, [success, error]);
    return (
        <Fragment>
            <div className="background-image"></div>
            <div className="addUser--wrapper">
                <form className="addUser--wrapper__form" onSubmit={handleSubmit}>
                    {hideUsernameField === false &&
                        <div className="input-field">
                            <input
                                ref={usernameRef}
                                type="text"
                                id="username"
                                name="username"
                                className="addUser--wrapper__input"
                                placeholder="Username"
                                onChange={handleOnChangeEvent}
                            />
                            {errors?.username?.length > 0 &&
                                <p className="errors">{errors.username}</p>}
                        </div>}
                        <div className="input-field">
                            {login&&errors?.length > 0 &&
                                <p className="errors login">{errors === "Rejected" ? "ACCESS DENIED": ""}</p>}
                            <input
                                ref={emailRef}
                                type="text"
                                id="email"
                                name="email"
                                className="addUser--wrapper__input"
                                placeholder="Email"

                                onChange={handleOnChangeEvent}
                            />
                            {errors?.email?.length > 0 &&
                                <p className="errors">{errors.email}</p>}
                        </div>

                        <div className="input-field">
                            <input
                                ref={passwordRef}
                                type="password"
                                id="password"
                                name="password"
                                className="addUser--wrapper__input"
                                placeholder="Password"
                                onChange={handleOnChangeEvent}
                            />
                            {errors?.password?.length > 0 &&
                                <p className="errors">{errors.password}</p>}

                        </div>

                    {login && <NavLink to="/register" className="addUser--wrapper__registerMsg">No account? Register Now</NavLink>}
                        <button className="addUser--wrapper__button" type="submit">SUBMIT</button>
                        </form>
                        <p className="addUser--wrapper__title">{title}</p>

                    {loading && <LoaderSpinner />}
                        </div>
                        </Fragment>

                        );
                    }

                    export default FormUser;