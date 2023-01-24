import {
  combineReducers,
  configureStore,
  PreloadedState,
} from '@reduxjs/toolkit';

// Redux reducers
import phobiasReducer from '../../features/phobias/phobiasSlice';
import groupsReducer from '../../features/groups/groupsSlice';
import userReducer from '../../features/user/userSlice';
import topicsReducer from '../../features/topics/topicsSlice';

// Combine reducers to create a root reducer
const rootReducer = combineReducers({
  topics: topicsReducer,
  phobias: phobiasReducer,
  groups: groupsReducer,
  user: userReducer,
});

// Use the root reducer to create a store
export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
};

// Export a typed version of the store
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
