import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface ContextMenuState {
  open: boolean
  position?: {x: number, y: number}
}

const initialState: ContextMenuState = {
  open: false,
}

export const contextMenuSlice = createSlice({
  name: 'context-menu',
  initialState,
  reducers: {
    open: (state, action: PayloadAction<{x: number, y: number}>) => {
      state.open = true
      state.position = action.payload
    },
    close: (state) => {
      state.open = false
    }
  },
})

// Action creators are generated for each case reducer function
export const contextMenuActions = contextMenuSlice.actions

export default contextMenuSlice.reducer