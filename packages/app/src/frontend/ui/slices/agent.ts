import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AgentState {
  credits: number
}

const initialState: AgentState = {
  credits: 0
}

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setCredits: (state, action: PayloadAction<number>) => {
      state.credits = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const agentActions = agentSlice.actions

export default agentSlice.reducer