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
        }
    }
})

export const {loadUser} = userSlice.actions;
export default userSlice.reducer;
