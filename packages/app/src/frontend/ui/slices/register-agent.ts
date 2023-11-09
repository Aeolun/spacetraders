import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface RegisterAgentState {
  registerServer: string,
  registerFaction: string,
  registerSymbol: string,
  registerEmail: string,
}

const initialState: RegisterAgentState = {
  registerEmail: '',
  registerFaction: '',
  registerSymbol: '',
  registerServer: '',
}

export const registerAgentSlice = createSlice({
  name: 'register-agent',
  initialState,
  reducers: {
    setRegisterServer: (state, action: PayloadAction<string>) => {
      state.registerServer = action.payload
    },
    setRegisterFaction: (state, action: PayloadAction<string>) => {
      state.registerFaction = action.payload
    },
    setRegisterSymbol: (state, action: PayloadAction<string>) => {
      state.registerSymbol = action.payload
    },
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.registerEmail = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const registerAgentActions = registerAgentSlice.actions

export default registerAgentSlice.reducer