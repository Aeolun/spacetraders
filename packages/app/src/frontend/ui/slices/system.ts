import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {ShipData, System} from "@front/viewer/registry";

export interface SystemState {
  system: Record<string, System>
}

const initialState: SystemState = {
  system: {}
}

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setSystemInfo: (state, action: PayloadAction<System>) => {
      state.system[action.payload.symbol] = action.payload
    },
    setAllSystemInfo: (state, action: PayloadAction<Record<string, System>>) => {
      state.system = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const systemActions = systemSlice.actions

export default systemSlice.reducer