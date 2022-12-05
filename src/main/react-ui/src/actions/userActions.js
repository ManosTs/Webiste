import {createAsyncThunk} from "@reduxjs/toolkit";
import {addUser, loginUser, logout} from "../services/serviceApi";

export const authUser = createAsyncThunk('user/login', async ({email, password}) => {
    return await loginUser({email, password}).then(data => data).catch(error => error);
})

export const registerUser = createAsyncThunk('user/register', async ({username, email, password}) => {
    return await addUser({username, email, password}).then(data => data).catch(error => error);
})

export const logoutUser = createAsyncThunk('user/logout', async ({id}) => {
    return await logout({id}).then(data => data).catch(error => error);
})



