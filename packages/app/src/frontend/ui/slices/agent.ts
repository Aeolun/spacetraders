import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AgentState {
  credits: number
  headquarters: string | null
}

const initialState: AgentState = {
  credits: 0,
  headquarters: '',
}

export const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setCredits: (state, action: PayloadAction<number>) => {
      state.credits = action.payload
    },
    setHeadquarters: (state, action: PayloadAction<string | null>) => {
      state.headquarters = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const agentActions = agentSlice.actions

export default agentSlice.reducer