import './FormInput.scss';
import Icon from "../../Icon";
import {Fragment, useEffect, useRef, useState} from "react";
import FormButton from "./FormButton";
import {createUser} from "../../services/UserService";
import Alert from "../Alert/Alert";

function FormInput({name, id, handleChange, onClick, iconName, label, type, autoComplete, placeholder, onFocus, onBlur}) {
    return(

        <div className="form-input">
            <label htmlFor={id}>{label}</label>
            <div className="icon_wrapper">
                <input onBlur={onBlur}
                       onFocus={onFocus}
                       onClick={onClick}
                       placeholder={placeholder}
                       autoComplete={autoComplete}
                       name={name}
                       onChange={handleChange}
                       type={type}
                       id={id}/>
                {iconName&& <Icon name={iconName} color="#000" size={17}/>}
            </div>
        </div>

    );
}

export default FormInput;
