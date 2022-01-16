import {createSlice} from '@reduxjs/toolkit';

import {Gallery} from 'Module/Profile/store/slices';
import {createAsyncThunkWithErrorHandling, logout} from 'Services/Thunk';
import {addUserDailyStories, addUserProfileStories, changeProfileStoriesOrder, deleteProfileStory} from 'Services/API';
import {DataStates} from 'Util/constants/dataState.enum';

const SLICE_NAME = 'stories';

export const addProfileStory = createAsyncThunkWithErrorHandling(
  `${SLICE_NAME}/addProfileStory`,
  async (photos: FormData) => await addUserProfileStories(photos),
);

export const addDailyStory = createAsyncThunkWithErrorHandling(
  `${SLICE_NAME}/addDailyStory`,
  async (photos: FormData) => await addUserDailyStories(photos),
);

export const updateProfileStoriesOrder = createAsyncThunkWithErrorHandling(
  `${SLICE_NAME}/updateProfileStoriesOrder`,
  async (storiesOrder: Array<number>): Promise<Gallery> => await changeProfileStoriesOrder(storiesOrder),
);

export const deleteProfileStoryAction = createAsyncThunkWithErrorHandling(
  `${SLICE_NAME}/deleteProfileStory`,
  async (storiesIds: [number]) => await deleteProfileStory(storiesIds),
);

type storiesState = {
  dataState: DataStates;
  photos: string[];
};

const initialState: storiesState = {
  dataState: DataStates.NotAsked,
  photos: [],
};

export const storiesSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    addStoriesPhoto(state, action) {
      const photos = [...state.photos];
      const photo: string = action.payload;
      photos.push(photo);
      state.photos = photos;
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, state => {
      Object.assign(state, initialState);
    });
    builder.addCase(deleteProfileStoryAction.pending, state => {
      state.dataState = DataStates.Pending;
    });
    builder.addCase(deleteProfileStoryAction.fulfilled, state => {
      state.dataState = DataStates.Fulfilled;
    });
    builder.addCase(deleteProfileStoryAction.rejected, state => {
      state.dataState = DataStates.Rejected;
    });
    builder.addCase(addProfileStory.pending, state => {
      state.dataState = DataStates.Pending;
    });
    builder.addCase(addProfileStory.fulfilled, state => {
      state.dataState = DataStates.Fulfilled;
    });
    builder.addCase(addProfileStory.rejected, state => {
      state.dataState = DataStates.Rejected;
    });
    builder.addCase(addDailyStory.pending, state => {
      state.dataState = DataStates.Pending;
    });
    builder.addCase(addDailyStory.fulfilled, state => {
      state.dataState = DataStates.Fulfilled;
    });
    builder.addCase(addDailyStory.rejected, state => {
      state.dataState = DataStates.Rejected;
    });
  },
});

export const {addStoriesPhoto} = storiesSlice.actions;

export default storiesSlice.reducer;
