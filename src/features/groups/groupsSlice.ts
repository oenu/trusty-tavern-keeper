import { createSlice } from '@reduxjs/toolkit';
import { User } from '../user/userSlice';
import { RootState } from './../../lib/redux/store';

/**
 * Groups are temporary collections of users that are used to create a party for a game session.
 * Each group will have a unique id, a name, an invite link, and an "intensity" value (Fantasy, Adventure, Struggle, Tragedy) that is used to determine the type of game session.
 * Users can join a group by following a link that is generated when the group is created.
 */

// Define a type for the slice state
interface GroupsState {
  groups: Group[];
}

// Define a type for the slice state
export interface Group {
  id: number;
  name: string;
  inviteCode: string;
  intensity: number; // 1 = Fantasy, 2 = Adventure, 3 = Struggle, 4 = Tragedy
  users: User[];
}

// Define the initial state using that type
const initialState: GroupsState = {
  groups: [
    {
      id: 1,
      name: 'Group 1',
      inviteCode: 'https://www.google.com',
      intensity: 1,
      users: [],
    },
  ],
};

export const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    addGroup: (state, action: { payload: Group }) => {
      state.groups.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { addGroup } = groupsSlice.actions;

// Export the customized selectors for this slice
export const selectGroups = (state: RootState) => state.groups.groups;

// Other code such as selectors can use the imported `RootState` type
export const selectGroupById = (state: RootState, groupId: number) =>
  state.groups.groups.find((group) => group.id === groupId);

// Export the reducer, either as a default or named export
export default groupsSlice.reducer;
