import { RootState } from './../../lib/redux/store';
import { createSlice } from '@reduxjs/toolkit';

/**
 * Phobias are a list of fears that a user might have. Each survey respondent will respond to each phobia with either 0, 1, 2, 3, 4, or 5.
 * 0 = No Preference/No Response
 * 1 = Not affected
 * 2 = Wary (Willing to use this content in the DND game, but only sparingly)
 * 3 = Concerned (Willing to use this content if a warning is given at the start of the session)
 * 4 = Uncomfortable (user would prefer not to use this content, but can work around it/with it)
 * 5 = Avoid (user would prefer not to use this content at all. This overrides all other responses from other users in the party)
 *
 * Users can add their own phobias, but they will be added to the end of the list, and will be assigned a new uuid as their id.
 */

// Define a type for the slice state
interface PhobiasState {
  phobias: Phobia[];
}

// Define a type for the slice state
export interface Phobia {
  id: number;
  name: string;
  description: string;
  preference: number; // 1 = Unaffected, 2 = Neutral; 3 = Warning; 4 = Ban;
}

// Define the initial state using that type
const initialState: PhobiasState = {
  phobias: [
    {
      id: 1,
      name: 'Spiders',
      description: 'Spiders of any kind',
      preference: 0,
    },
    {
      id: 2,
      name: 'Torture',
      description: 'Torture against the characters',
      preference: 0,
    },
  ],
};

export const phobiasSlice = createSlice({
  name: 'phobias',
  initialState,
  reducers: {
    addPhobia: (state, action: { payload: Phobia }) => {
      state.phobias.push(action.payload);
    },
  },
});

// Export reducer actions
export const { addPhobia } = phobiasSlice.actions;

// Export selectors for the slice state
export const selectPhobias = (state: RootState) => state.phobias.phobias;

// Export the reducer as a default export
export default phobiasSlice.reducer;
