import {createSlice} from '@reduxjs/toolkit';

import {logout} from 'Services/Thunk';
import {heightData} from 'Util/constants/registrationData';

const SLICE_NAME = 'registration';

export interface Location {
  latitude: number;
  longitude: number;
}

type registrationState = {
  photos: string[];
  name?: string;
  birthday?: string;
  height?: string;
  bodyType?: string;
  gender?: string;
  pleasures: string[];
  prefer: string[];
  ethnicity?: string | null;
  displayEthnicity?: boolean;
  location?: Location;
};

const initialState: registrationState = {
  photos: [],
  height: heightData[0],
  bodyType: 'Choose',
  gender: 'Male',
  name: '',
  pleasures: [],
  prefer: [],
  ethnicity: null,
  displayEthnicity: true,
};

export const registrationSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setPhoto(state, action) {
      const photos = [...state.photos];
      const photo: string = action.payload;
      photos.push(photo);
      state.photos = photos;
    },
    replacePhoto(state, action) {
      const photos = [...state.photos];
      const currentPhoto: string = action.payload[0];
      const newPhoto: string = action.payload[1];
      const currentPhotoIndex = photos.findIndex(photoItem => photoItem === currentPhoto);
      photos.splice(currentPhotoIndex, 1, newPhoto);
      state.photos = photos;
    },
    deletePhoto(state, action) {
      const photos = [...state.photos];
      const photo = action.payload;
      const newPhotos = photos.filter(photoItem => photoItem !== photo);
      state.photos = newPhotos;
    },
    setHeight(state, action) {
      const height: string = action.payload;
      state.height = height;
    },
    setBodyType(state, action) {
      const bodyType: string = action.payload;
      state.bodyType = bodyType;
    },
    setGender(state, action) {
      const gender: string = action.payload;
      state.gender = gender;
    },
    setUserName(state, {payload}) {
      state.name = payload;
    },
    setBirthday(state, {payload}) {
      state.birthday = payload;
    },
    setPleasure(state, {payload}) {
      const pleasures = [...state.pleasures];
      const pleasure: string = payload;
      pleasures.push(pleasure);
      state.pleasures = pleasures;
    },
    deletePleasure(state, action) {
      const pleasures = [...state.pleasures];
      const pleasureIndex = action.payload;
      const newPleasures = pleasures.filter((pleasureItem, index) => index !== pleasureIndex);
      state.pleasures = newPleasures;
    },
    setPrefer(state, action) {
      const {payload} = action;

      if (state?.prefer && Array.isArray(state?.prefer)) {
        const index = state.prefer.indexOf(payload);

        if (index > -1) {
          state.prefer.splice(index, 1);
        } else {
          state.prefer = [...state.prefer, payload];
        }
      } else {
        state.prefer = [payload];
      }
    },
    setEthnicity(state, action) {
      const ethnicity: string = action.payload;
      state.ethnicity = ethnicity;
    },
    setDisplayEthnicity(state, action) {
      const displayEthnicity: boolean = action.payload;
      state.displayEthnicity = displayEthnicity;
    },
    setLocation(state, action) {
      const location: Location = action.payload;
      state.location = location;
    },
  },
  extraReducers: builder => {
    builder.addCase(logout, state => {
      Object.assign(state, initialState);
    });
  },
});

export const {
  setPhoto,
  replacePhoto,
  deletePhoto,
  setHeight,
  setBodyType,
  setGender,
  setUserName,
  setBirthday,
  setPleasure,
  deletePleasure,
  setPrefer,
  setEthnicity,
  setDisplayEthnicity,
  setLocation,
} = registrationSlice.actions;

export default registrationSlice.reducer;
