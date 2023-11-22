import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { ConsolidatedPrice } from '@common/prisma'

export interface GoodsState {
  goods: Record<string, ConsolidatedPrice>
}

const initialState: GoodsState = {
  goods: {}
}

export const goodsSlice = createSlice({
  name: 'goods',
  initialState,
  reducers: {
    setGoods: (state, action: PayloadAction<ConsolidatedPrice[]>) => {
      action.payload.forEach(g => {
        state.goods[g.tradeGoodSymbol] = g
      })
    },
  },
})

// Action creators are generated for each case reducer function
export const goodsActions = goodsSlice.actions

export default goodsSlice.reducer