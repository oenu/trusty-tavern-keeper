import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './../../lib/redux/store';

/**
 * Topics are the questions about how a user wants to play a roleplaying session.
 * Each topic will have a unique id, a question, and a list of 4 possible options.
 * The user will select one of the options, and the answer will be used to determine the intensity of the game session.
 * 0 = Skip - The game session will be determined by the intensity of the group and a warning will be displayed when all the players are reviewing the game session.
 * 1 = Fantasy - The game session will be light-hearted and fun.
 * 2 = Adventure - The game session will be a little more serious, but still fun.
 * 3 = Struggle - The game session will be more serious, and will have some dark themes.
 * 4 = Tragedy - The game session will be very serious, and will have dark themes.
 *
 * Options will be shown in the following order: (skip option will be shown along with the other options)
 * 1. Fantasy
 * 2. Adventure
 * 3. Struggle
 * 4. Tragedy
 * A player can approve of each option, or by disapproving of the next option they will automatically select the previous option.
 * (4 buttons, "Less Intense", "More Intense", "Current Intensity", "No Preference")
 */

// Define a type for the slice state
interface TopicsState {
  topics: Topic[];
}

// Define a type for the slice state
export interface Topic {
  id: number; // Unique ID for the topic
  label: string; // Label for the topic (Combat, Exploration, etc.)
  question: string; // Question for the topic (You come across a monastery, what do you do?)
  options: {
    Fantasy: string;
    Adventure: string;
    Struggle: string;
    Tragedy: string;
  };
  response: number; // 0 = Skip, 1 = Fantasy, 2 = Adventure, 3 = Struggle, 4 = Tragedy
}

// Define the initial state using that type
const initialState: TopicsState = {
  topics: [
    {
      id: 1,
      label: 'Combat',
      question:
        'You are in a dungeon and a goblin attacks you. What do you do?',
      options: {
        Fantasy: 'I attack the goblin with my sword.',
        Adventure:
          'I attack the goblin with my sword, and I yell "For the glory of the king!"',
        Struggle:
          'I attack the goblin with my sword, and I yell "For the glory of the king!" as I stab him in the heart.',
        Tragedy:
          'I attack the goblin with my sword, and I yell "For the glory of the king!" as I stab him in the heart. I then cut off his tongue and attach it to my necklace of giblets',
      },
      response: 0,
    },
    {
      id: 2,
      label: 'Torture',
      question:
        'You are captured by a noble lord, how do they extract information from you',
      options: {
        Fantasy:
          "The noble lord leaves you in his dungeon for a day, you wish you'd eaten lunch",
        Adventure:
          'The noble lord chains you to a wall and leaves you there for a week, a rat nibbles on your toes',
        Struggle:
          'The noble lord chains you to a wall and leaves you there for a month, you are covered in flea bites, and you are forced to listen to the screams of other prisoners',
        Tragedy:
          "The noble lord chains you to a fetid wall next to a dying man, you are branded with the noble lord's sigil and left to die should you not tell him what he wants to know.",
      },
      response: 0,
    },
  ],
};

export const topicsSlice = createSlice({
  name: 'topics',
  initialState,
  reducers: {
    setTopicResponse: (
      state,
      action: { payload: { id: number; response: number } }
    ) => {
      const { id, response } = action.payload;
      const topic = state.topics.find((topic) => topic.id === id);
      if (topic) {
        topic.response = response;
      }
    },
    addTopic: (state, action: { payload: Topic }) => {
      state.topics.push(action.payload);
    },
  },
});

// Export reducer actions
export const { setTopicResponse, addTopic } = topicsSlice.actions;

// Export selectors for the slice state
export const selectTopics = (state: RootState) => state.topics.topics;

// Export the reducer as a default export
export default topicsSlice.reducer;
