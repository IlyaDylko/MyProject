import {createSelector} from 'reselect';

import {selectPhoneNumber} from 'Module/Auth/PhoneLogin/store/selectors';
import {RootState} from 'Store';

const userNameStateSelector = (state: RootState) => state.registration.name;
const registrationSelector = (state: RootState) => state.registration;

export const selectUserName = createSelector(userNameStateSelector, name => name);
export const selectRegistration = createSelector(registrationSelector, registration => registration);

const _selectPleasures = (state: RootState) => state.registration.pleasures;
export const selectPleasures = createSelector(_selectPleasures, pleasures =>
  Array.isArray(pleasures) ? pleasures : [],
);

export const userDataSelector = createSelector(
  registrationSelector,
  selectPhoneNumber,
  (registration, phone_number) => ({
    username: registration.name,
    phone_number,
    birth_date: registration.birthday,
    ethnicity: registration.ethnicity,
    display_ethnicity: registration.displayEthnicity,
    body_type: registration.bodyType === 'Choose' ? 'Athletic' : registration.bodyType,
    gender: registration.gender,
    tags: registration.pleasures,
    height_str: registration.height,

    accept_privacy_policy: true,
    location: {
      ...(registration.location || {}),
    },
    prefer: registration.prefer,
    photos: registration.photos,
  }),
);
