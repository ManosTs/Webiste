import {createAsyncThunk} from "@reduxjs/toolkit";
import {addUser, loginUser, logout} from "../services/serviceApi";

export const authUser = createAsyncThunk('user/login', async ({email, password}, {rejectWithValue}) => {
    try{
        const response = await loginUser({email, password}).then(data => data).catch(error => error);
        if (!response.ok) {
            return rejectWithValue(response)
        }
        return response;
    }catch (err){
        throw rejectWithValue(err)
    }
})

export const registerUser = createAsyncThunk('user/register',
    async ({username, email, password}, { rejectWithValue }) => {
    try{
        const response = await addUser({username, email, password}).then(data => data).catch(error => error);
        if (!response.ok) {
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



