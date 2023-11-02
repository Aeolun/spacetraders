import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AccountState {
  selection?: {
    type: string
    symbol: string
  }
}

const initialState: AccountState = {
  selection: undefined,
}

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelection: (state, action: PayloadAction<{type: string, symbol: string} | undefined>) => {
      state.selection = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const selectionActions = selectionSlice.actions

export default selectionSlice.reducer