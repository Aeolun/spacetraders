import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {ShipData} from "@front/viewer/registry";

export interface ShipState {
  ship: Record<string, ShipData>
}

const initialState: ShipState = {
  ship: {}
}

export const shipSlice = createSlice({
  name: 'ship',
  initialState,
  reducers: {
    setShipInfo: (state, action: PayloadAction<ShipData>) => {
      state.ship[action.payload.symbol] = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const shipActions = shipSlice.actions

export default shipSlice.reducer