import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {PanGestureHandler} from 'react-native-gesture-handler';

import {CarouselPagination} from './CarouselPagination';

import {screenHeight, screenWidth} from 'Util/dimensions';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {StoryMedia} from 'Module/Stories/ReviewStory/components/StoryMedia';

interface ProfileTopComponentProps {
  onBackgroundPress?: () => void;
  profilePhoto?: string;
  profilePhotos?: string[];
}

export const ProfileCarousel = (props: ProfileTopComponentProps) => {
  const {profilePhotos} = props;
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const itemWidth = screenWidth;
  const onImagePress = useCallback(() => {
    navigation.navigate(NAVIGATION_ROUTES.USER_PROFILE_MEDIA, {items: profilePhotos});
  }, [navigation, profilePhotos]);
  const renderItem = useCallback(
    ({item}) => {
      return (
        <Pressable onPress={onImagePress}>
          <StoryMedia type={item.type} uri={item.type === 'video' ? item.uri : item.uri} style={styles.carouselItem} />
        </Pressable>
      );
    },
    [onImagePress],
  );
  const getItemLayout = useCallback(
    (data, index) => ({length: itemWidth, offset: itemWidth * index, index}),
    [itemWidth],
  );
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  return (
    <>
      <Carousel
        data={profilePhotos}
        renderItem={renderItem}
        sliderWidth={screenWidth}
        itemWidth={itemWidth}
        firstItem={0}
        getItemLayout={getItemLayout}
        enableSnap={true}
        enableMomentum={true}
        horizontal={true}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        initialScrollIndex={0}
        keyExtractor={keyExtractor}
        bounces={false}
        onSnapToItem={index => setActiveIndex(index)}
      />
      <CarouselPagination activeIndex={activeIndex} items={profilePhotos} />
    </>
  );
};

const styles = StyleSheet.create({
  carouselItem: {
    height: screenHeight * 0.478,
    width: screenWidth,
    borderRadius: 0,
  },
});
