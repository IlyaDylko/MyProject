import BottomSheet from '@gorhom/bottom-sheet';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';

import {ReportSheet} from 'Common/BottomSheets/ReportSheet';
import {getActiveUserDailyStories, getActiveUserData} from 'Module/Search/Search/store/searchSelectors';
import {Stories} from 'Module/Stories/Stories/components/Stories';
import {StoriesHeader} from 'Module/Stories/Stories/components/StoriesHeader';

export const UserDailyStory = () => {
  const navigation = useNavigation();
  const reportRef = useRef<BottomSheet>(null);
  const {id, gallery, username, location, birth_date, tags, fan} = useSelector(getActiveUserData);
  const {photos} = gallery;
  const fixedDailyStories = useSelector(getActiveUserDailyStories);

  const userPhoto = photos?.length ? photos[0]?.presigned_url : null;

  const [activeIndex, setActiveIndex] = useState(0);
  const [optionsActive, setOptionsActive] = useState(false);

  const onClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onOptions = useCallback(() => {
    setOptionsActive(true);
    reportRef.current?.present();
  }, []);

  const setIndex = useCallback(index => {
    setActiveIndex(index);
  }, []);

  const onReport = useCallback(() => {}, []);

  const onCancel = useCallback(() => {
    setOptionsActive(false);
    reportRef?.current?.close();
  }, []);

  return (
    <View style={styles.container}>
      <StoriesHeader
        onClose={onClose}
        onOptions={onOptions}
        imageUri={userPhoto}
        userName={username}
        lastOnline={'2h ago'}
      />
      <Stories isPaused={optionsActive} activePhotos={fixedDailyStories} setIndex={setIndex} />
      <ReportSheet onCancel={onCancel} onReport={onReport} ref={reportRef} />
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
