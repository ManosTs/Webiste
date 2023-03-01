import * as api from '../services/serviceApi.js';
import {Fragment, useEffect, useRef, useState} from "react";
import './FormUser.scss';
import LoaderSpinner from "./LoaderSpinner";
import {NavLink} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {authUser, registerUser} from "../actions/userActions";
import {loginUser} from "../services/serviceApi.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import { format } from 'date-fns'

function FormUser({title, login}) {
    const usernameRef = useRef('');
    const firstNameRef = useRef('');
    const lastNameRef = useRef('');
    const birthDateRef = useRef('');
    const genderRef = useRef('');
    const passwordRef = useRef('');
    const emailRef = useRef('');
    const [showPass, setShowPass] = useState(false);
    const [dataUser, setDataUser] = useState({});
    const [errors, setErrors] = useState({});
    let history = useNavigate();

    const {loading, error, results, success, statusCode} = useSelector(state => state.user);

    const dispatch = useDispatch();

    const handleOnChangeEvent = () => {
        setDataUser({
            username: usernameRef.current.value,
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            birthDate: birthDateRef.current.value,
            gender: genderRef.current.value,
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

    const togglePassword = () => {
        setShowPass(!showPass);
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


    useEffect(() => {

        if (!showPass) {

        }
    }, [showPass]);

    return (
        <Fragment>
            <div className="background-image"></div>
            <div className="addUser--wrapper">
                <form className="addUser--wrapper__form" onSubmit={handleSubmit}>
                    {!login &&
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
                            <PermIdentityIcon/>
                            {errors?.username?.length > 0 &&
                                <p className="errors">{errors.username}</p>}
                        </div>}
                    <div className="input-field">
                        {login && errors?.length > 0 &&
                            <p className="errors login">{errors === "Rejected" ? "ACCESS DENIED" : ""}</p>}
                        <input
                            ref={emailRef}
                            type="text"
                            id="email"
                            name="email"
                            className="addUser--wrapper__input"
                            placeholder="Email"

                            onChange={handleOnChangeEvent}
                        />
                        <MailOutlineIcon/>
                        {errors?.email?.length > 0 &&
                            <p className="errors">{errors.email}</p>}
                    </div>
                    {!login &&
                        <div className="input-field">
                            <input
                                ref={firstNameRef}
                                type="text"
                                id="firstName"
                                name="firstName"
                                className="addUser--wrapper__input"
                                placeholder="First Name"
                                onChange={handleOnChangeEvent}
                            />
                            <PermIdentityIcon/>
                            {errors?.firstName?.length > 0 &&
                                <p className="errors">{errors.firstName}</p>}
                        </div>}
                    {!login &&
                        <div className="input-field">
                            <input
                                ref={lastNameRef}
                                type="text"
                                id="lastName"
                                name="lastName"
                                className="addUser--wrapper__input"
                                placeholder="Last Name"
                                onChange={handleOnChangeEvent}
                            />
                            <PermIdentityIcon/>
                            {errors?.lastName?.length > 0 &&
                                <p className="errors">{errors.lastName}</p>}
                        </div>}
                    {!login &&
                        <div className="input-field">
                            <input
                                ref={birthDateRef}
                                type="date"
                                id="birthDate"
                                name="birthDate"
                                className="addUser--wrapper__input"
                                placeholder="Birth Date"
                                onChange={handleOnChangeEvent}
                            />
                            {errors?.birthDate?.length > 0 &&
                                <p className="errors">{errors.birthDate}</p>}
                        </div>}

                    <div className="input-field">
                        <input
                            ref={passwordRef}
                            type={showPass ? "text" : "password"}
                            id="password"
                            name="password"
                            className="addUser--wrapper__input"
                            placeholder="Password"
                            onChange={handleOnChangeEvent}
                        />
                        {showPass && <VisibilityIcon onClick={togglePassword}/>}
                        {!showPass && <VisibilityOffIcon onClick={togglePassword}/>}
                        {errors?.password?.length > 0 &&
                            <p className="errors">{errors.password}</p>}

                    </div>
                    {!login &&
                        <div className="input-field">
                            {/*<input*/}
                            {/*    ref={genderRef}*/}
                            {/*    type="text"*/}
                            {/*    id="gender"*/}
                            {/*    name="gender"*/}
                            {/*    className="addUser--wrapper__input"*/}
                            {/*    placeholder="Gender"*/}
                            {/*    onChange={handleOnChangeEvent}*/}
                            {/*/>*/}
                            <select
                                ref={genderRef}
                            onChange={handleOnChangeEvent}>

                                <option value="Male">Male</option>

                                <option value="Female">Female</option>

                                <option value="Other">Other</option>

                            </select>
                            {errors?.gender?.length > 0 &&
                                <p className="errors">{errors.gender}</p>}
                        </div>}
                    {login && <NavLink to="/register" className="addUser--wrapper__registerMsg">No account? Register
                        Now</NavLink>}
                    <button className="addUser--wrapper__button" type="submit">SUBMIT</button>
                </form>
                <p className="addUser--wrapper__title">{title}</p>

                {loading && <LoaderSpinner/>}
            </div>
        </Fragment>

    );
}

export default FormUser;