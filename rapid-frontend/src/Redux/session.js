import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
	name: "session",
	initialState: {
		player: false
	},
	reducers: {
		playerLog:(state) =>{
			state.player = true;
		}
	}
})

export const {playerLog} = sessionSlice.actions;
export default sessionSlice.reducer;