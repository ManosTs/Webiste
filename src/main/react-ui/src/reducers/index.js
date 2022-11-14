import authContext from "./authentication";
import {combineReducers} from "@reduxjs/toolkit";

const reducers = combineReducers({
    isAuthenticated: authContext
})

export default reducers;

