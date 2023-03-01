import {createAsyncThunk} from "@reduxjs/toolkit";
import {addUser, loginUser, logout, refreshToken} from "../services/serviceApi";

export const authUser = createAsyncThunk('user/login', async ({email, password}, {rejectWithValue}) => {
    try{
        const response = await loginUser({email, password}).then(data => data).catch(error => error);

        if (response.status === "400" || response.status === "403" || response.status === "401") {
            return rejectWithValue(response)
        }
        return response;
    }catch (err){
        throw rejectWithValue(err)
    }
})

export const refreshUser = createAsyncThunk('user/refresh-token', async ({id}, {rejectWithValue}) => {
    try{
        const response = await refreshToken({id}).then(data => data).catch(error => error);
        console.log(response);
        // if (response.status === "400" || response.status === "403" || response.status === "401") {
        //     return rejectWithValue(response)
        // }
        return response;
    }catch (err){
        throw rejectWithValue(err)
    }
})

export const registerUser = createAsyncThunk('user/register',
    async ({username, email, firstName, lastName, gender, birthDate,password}, { rejectWithValue }) => {
    try{
        const response = await addUser({username, email, firstName, lastName, gender, birthDate,password}).then(data => data).catch(error => error);

        if (response?.CODE !== "200") {
            return rejectWithValue(response)
        }
        return response;
    }catch (err){
        throw rejectWithValue(err)
    }

})

export const logoutUser = createAsyncThunk('user/logout', async ({id}) => {
    return await logout({id}).then(data => data).catch(error => error);
})



