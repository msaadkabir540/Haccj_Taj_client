import { createSlice } from "@reduxjs/toolkit";
import { Users } from "../interface";

const initialState: {
  users: Users[];
} = {
  users: [],
};

const users = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = users.actions;

export default users.reducer;
