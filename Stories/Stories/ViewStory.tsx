import React, {useCallback, useRef, useState, useEffect, useLayoutEffect} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';

import {Stories} from './components/Stories';
import {StoriesHeader} from './components/StoriesHeader';

import {selectProfileDataState, selectProfileStories, userProfileSelector} from 'Module/Profile/store/selectors';
import {deleteProfileStoryAction} from 'Module/Stories/store/storiesSlice';
import {getUser} from 'Module/Profile/store/slices';
import {DataStates} from 'Util/constants/dataState.enum';
import {selectStoriesDataState} from 'Module/Stories/store/storiesSelectors';
import {DeleteStorySheet} from 'Common/BottomSheets/DeleteStorySheet';
import {CantDeleteStorySheet} from 'Common/BottomSheets/CantDeleteStorySheet';
import {NAVIGATION_ROUTES} from 'Navigation/routes';

export const ViewStory = () => {
  const deleteStorySheetRef = useRef<BottomSheet>(null);
  const cantDeleteStorySheetRef = useRef<BottomSheet>(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const [optionsActive, setOptionsActive] = useState(false);

  const profileDataState = useSelector(selectProfileDataState);
  const storiesDataState = useSelector(selectStoriesDataState);
  const profileStories = useSelector(selectProfileStories);
  const {userName, photos, gallery} = useSelector(userProfileSelector);
  const rawProfileStories = gallery?.profile_stories;

  const onClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onOptions = useCallback(() => {
    setOptionsActive(true);

    deleteStorySheetRef.current?.present();
  }, []);

  const deleteStory = useCallback(() => {
    if (profileStories?.length === 1) {
      deleteStorySheetRef?.current?.close();
      setTimeout(() => cantDeleteStorySheetRef.current?.present(), 450);
    } else if (profileStories?.length > 1) {
      const arrayWithIds = [rawProfileStories[activeIndex].id];
      dispatch(deleteProfileStoryAction(arrayWithIds));
      setOptionsActive(false);
      deleteStorySheetRef?.current?.close();
    }
  }, [activeIndex, dispatch, profileStories?.length, rawProfileStories]);

  const setIndex = useCallback(index => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    if (storiesDataState === DataStates.Fulfilled) {
      dispatch(getUser());
    }
  }, [dispatch, storiesDataState]);

  useLayoutEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const onCancelDelete = useCallback(() => {
    setOptionsActive(false);
    deleteStorySheetRef?.current?.close();
  }, []);

  const onCancelCantDelete = useCallback(() => {
    setOptionsActive(false);
    cantDeleteStorySheetRef?.current?.close();
  }, []);

  const onChangeProfileStory = useCallback(() => {
    setOptionsActive(false);
    cantDeleteStorySheetRef?.current?.close();
    navigation.navigate(NAVIGATION_ROUTES.CREATE_STORY, {storyType: 'daily'});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StoriesHeader
        onClose={onClose}
        onOptions={onOptions}
        imageUri={photos?.length ? photos[0]?.presigned_url : null}
        userName={userName}
        lastOnline={'2h ago'}
      />
      {profileDataState === DataStates.Fulfilled ? (
        <Stories isPaused={optionsActive} activePhotos={profileStories} setIndex={setIndex} />
      ) : (
        <ActivityIndicator size={'large'} style={styles.activity} />
      )}

      <DeleteStorySheet onCancel={onCancelDelete} deleteStory={deleteStory} ref={deleteStorySheetRef} />
      <CantDeleteStorySheet
        onCancel={onCancelCantDelete}
        onChangeProfileStory={onChangeProfileStory}
        ref={cantDeleteStorySheetRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  activity: {
    flex: 1,
    justifyContent: 'center',
  },
});
