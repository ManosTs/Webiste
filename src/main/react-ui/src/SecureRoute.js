import {Component, useEffect, useState} from "react";
import {Navigate, Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Cookies from 'js-cookie';

const SecureRoute = ({children}) => {
    const loggedIn = JSON.parse(sessionStorage.getItem('login-details'));
    const isAuthenticated =  () => {
        if(loggedIn == null){
            return false;
        }
        return loggedIn.accessToken != null;
    };


    if(!isAuthenticated()){
        return <Navigate to={'/login'} />
    }

    return children;
}

export default SecureRoute;