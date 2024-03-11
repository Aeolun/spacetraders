import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './slices/account';
import registerAgentReducer from 'src/frontend/ui/slices/register-agent';
import agentReducer from './slices/agent';
import selectionReducer from './slices/selection';
import contextMenuReducer from './slices/context-menu';
import shipReducer from './slices/ship';
import goodsReducer from './slices/goods';
import systemReducer from './slices/system';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    registerAgent: registerAgentReducer,
    agent: agentReducer,
    selection: selectionReducer,
    contextMenu: contextMenuReducer,
    ship: shipReducer,
    goods: goodsReducer,
    system: systemReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch