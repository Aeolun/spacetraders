import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/account';
import agentReducer from './slices/agent';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    agent: agentReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch