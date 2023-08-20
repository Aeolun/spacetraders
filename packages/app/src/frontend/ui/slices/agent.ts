import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AccountState {
  registerServer: string,
  registerFaction: string,
  registerSymbol: string,
  registerEmail: string,
}

const initialState: AccountState = {
  registerEmail: '',
  registerFaction: '',
  registerSymbol: '',
  registerServer: '',
}

export const agentSlice = createSlice({
  name: 'account',
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
export const agentActions = agentSlice.actions

export default agentSlice.reducer