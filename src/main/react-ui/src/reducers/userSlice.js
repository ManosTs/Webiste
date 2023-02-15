import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authUser, logoutUser, refreshUser, registerUser} from "../actions/userActions";
import {refreshToken} from "../services/serviceApi";

const initialState = {
    loading: false,
    error: null,
    success: false,
    results: {},
    actionType: null,
    statusCode: null
};

const userSlice = createSlice({
        name: 'user',
        initialState,
        reducers: {

        },
        extraReducers(builder) {
            builder
                .addCase(registerUser.pending, (state, action) => {
                    state.loading = true
                })
                .addCase(registerUser.fulfilled, (state, action) => {
                    state.loading = false
                    state.success = true
                    state.results = action.payload
                    state.actionType = action.type
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.loading = false
                    state.success = false
                    state.error = action.payload
                    state.actionType = action.type
                })
                .addCase(authUser.pending, (state, action) => {
                    state.loading = true
                })
                .addCase(authUser.fulfilled, (state, action) => {
                    state.loading = false
                    state.success = true
                    state.results = action.payload
                    state.actionType = action.type
                })
                .addCase(authUser.rejected, (state, action) => {
                    state.loading = false
                    state.success = false
                    state.error = action.error.message
                    state.actionType = action.type
                })
                .addCase(logoutUser.pending, (state, action) => {
                    state.loading = true
                })
                .addCase(logoutUser.fulfilled, (state, action) => {
                    state.loading = false
                    state.success = true
                    state.results = action.payload
                    state.actionType = action.type
                })
                .addCase(logoutUser.rejected, (state, action) => {
                    state.loading = false
                    state.success = false
                    state.error = action.error.message
                    state.actionType = action.type
                })
                .addCase(refreshUser.pending, (state, action) => {
                    state.loading = true
                })
                .addCase(refreshUser.fulfilled, (state, action) => {
                    state.loading = false
                    state.success = true
                    state.actionType = action.type
                })
                .addCase(refreshUser.rejected, (state, action) => {
                    state.loading = false
                    state.success = false
                    state.error = action.error.message
                    state.actionType = action.type
                })
        }
    },
);

export default userSlice.reducer;