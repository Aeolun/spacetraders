import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AccountState {
  registerEmail: string,
  registerPassword: string,
  loginEmail: string,
  loginPassword: string,
}

const initialState: AccountState = {
  registerEmail: '',
  registerPassword: '',
  loginEmail: '',
  loginPassword: '',
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setRegisterEmail: (state, action: PayloadAction<string>) => {
      state.registerEmail = action.payload
    },
    setRegisterPassword: (state, action: PayloadAction<string>) => {
      state.registerPassword = action.payload
    },
    setLoginEmail: (state, action: PayloadAction<string>) => {
      state.loginEmail = action.payload
    },
    setLoginPassword: (state, action: PayloadAction<string>) => {
      state.loginPassword = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const accountActions = accountSlice.actions

export default accountSlice.reducer