// src/features/subscription/subscriptionSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topics: {}, // { [topicName]: true/false }
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription(state, action) {
      const { topic, isSubscribed } = action.payload;
      state.topics[topic] = isSubscribed;
    },
  },
});

export const { setSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
