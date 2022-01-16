import {useNavigation} from '@react-navigation/core';
import {StackActions, useRoute} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {CloseButton} from 'Module/Stories/components';
import {StoryMedia} from 'Module/Stories/ReviewStory/components/StoryMedia';
import {IconsCarousel} from 'Module/UserProfile/UserProfileMedia/IconsCarousel';
import {OptionsButton} from 'Common/buttons/OptionsButton';
import {rem} from 'Util/dimensions';
import {ReportSheet} from 'Common/BottomSheets/ReportSheet';

export const UserProfileMedia = () => {
  const reportRef = useRef();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {items} = route.params;
  const [activeIndex, setActiveIndex] = useState(0);

  const onClosePress = useCallback(() => {
    navigation.dispatch(StackActions.pop(1));
  }, [navigation]);
  const onItemPress = useCallback(index => {
    setActiveIndex(index);
  }, []);
  const onOptions = useCallback(() => {
    reportRef?.current?.present();
  }, []);
  const onReport = useCallback(() => {}, []);
  return (
    <View style={styles.container}>
      <View style={{marginTop: insets.top + 15, marginBottom: insets.bottom}}>
        <StoryMedia
          type={items[activeIndex].type}
          uri={items[activeIndex].type === 'video' ? items[activeIndex].uri : items[activeIndex].uri}
          style={styles.media}
        />
        <CloseButton onClose={onClosePress} />
        <OptionsButton onPress={onOptions} style={styles.optionsButton} />
      </View>
      <View style={[styles.bottomView]}>
        <IconsCarousel onItemPress={onItemPress} items={items} />
      </View>
      <ReportSheet onReport={onReport} ref={reportRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  bottomView: {
    position: 'absolute',
    bottom: 60,
  },
  media: {
    height: '100%',
  },
  optionsButton: {
    right: rem(55),
  },
});
