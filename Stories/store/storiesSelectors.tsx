import {createSelector} from 'reselect';

const storiesSelector = state => state.stories;

export const selectStoriesDataState = createSelector(storiesSelector, stories => stories.dataState);
export const selectStories = createSelector(storiesSelector, stories => stories);
