import { createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/redux/store';
import { Group } from '../groups/groupsSlice';
import { Phobia } from '../phobias/phobiasSlice';
import { Topic } from '../topics/topicsSlice';

/**
 * Users are the players using the app
 * Each user will have a unique id, Discord ID, a name, a list of phobias, a list of Topic Responses, and a list of groups.
 * The user state will be used to store responses to topics, phobias and custom responses before being sent to the server.
 */

// Define a type for the slice state
interface UserState {
  user: User;
}

// Define a type for the slice state
export interface User {
  id: number;
  discordId: string;
  name: string;
  phobias: Phobia[];
  topics: Topic[];
  groups: Group[];
}

// Define the initial state using that type
const initialState: UserState = {
  user: {
    id: 1,
    discordId: '1234567890',
    name: 'Test User',
    phobias: [],
    topics: [],
    groups: [],
  },
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUser: (state, action: { payload: User }) => {
      state.user = action.payload;
    },
  },
});

// Export reducer actions
export const { setUser } = usersSlice.actions;

// Export the customized selectors for this slice
export const selectUsers = (state: RootState) => state.user.user;

// Export the reducer as a default export
export default usersSlice.reducer;
