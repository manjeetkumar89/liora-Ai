import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    user : null
}

export const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers :{
        loadUser : (state, action) =>{
            state.user = action.payload;
            console.log("user loaded" , state.user);
        },
        logoutUser : (state)=>{
            state.user = null;
        }
    }
})

export const {loadUser,logoutUser} = userSlice.actions;
export default userSlice.reducer;
