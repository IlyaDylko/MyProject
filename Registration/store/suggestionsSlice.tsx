import {createSlice} from '@reduxjs/toolkit';

import {getSuggestions} from 'Services/API';
import {createAsyncThunkWithErrorHandling} from 'Services/Thunk';
import {DataStates} from 'Util/constants/dataState.enum';
const SLICE_NAME = 'registration';

export const getSuggestionsThunk = createAsyncThunkWithErrorHandling(
  `${SLICE_NAME}/getSuggestions`,
  async () => await getSuggestions(), // Use 1111 for test confirmation
);

interface registrationState {
  dataState: DataStates;
  suggestions: string[];
}

const initialState: registrationState = {
  dataState: DataStates.NotAsked,
  suggestions: [],
};

export const suggestionsSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getSuggestionsThunk.pending, state => {
      state.dataState = DataStates.Pending;
    });
    builder.addCase(getSuggestionsThunk.fulfilled, (state, {payload}) => {
      state.dataState = DataStates.Fulfilled;
      state.suggestions = payload;
    });
    builder.addCase(getSuggestionsThunk.rejected, state => {
      state.dataState = DataStates.Rejected;
    });
  },
});

export default suggestionsSlice.reducer;
