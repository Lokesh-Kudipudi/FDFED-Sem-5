import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tours: [],
  hotels: [],
};

const recommendationSlice = createSlice({
  name: 'recommendation',
  initialState,
  reducers: {
    setRecommendations: (state, action) => {
      state.tours = action.payload.tours || [];
      state.hotels = action.payload.hotels || [];
    },
    resetRecommendations: (state) => {
      state.tours = [];
      state.hotels = [];
    },
  },
});

export const { setRecommendations, resetRecommendations } = recommendationSlice.actions;
export default recommendationSlice.reducer;
