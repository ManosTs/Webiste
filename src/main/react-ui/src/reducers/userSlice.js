import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authUser, registerUser} from "../actions/userActions";

const initialState = {
    loading: false,
    error: null,
    success: false,
    results: {},
    authenticated: false
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
                })
                .addCase(registerUser.rejected, (state, action) => {
                    state.loading = false
                    state.success = false
                    state.error = action.error.message
                })
                .addCase(authUser.pending, (state, action) => {
                    state.loading = true
                })
                .addCase(authUser.fulfilled, (state, action) => {
                    state.loading = false
                    state.success = true
                    state.results = action.payload
                })
                .addCase(authUser.rejected, (state, action) => {
                    state.loading = false
                    state.success = false
                    state.error = action.error.message
                })
        }
    },
);

export default userSlice.reducer;