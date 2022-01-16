import React from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {useAnimatedScrollHandler, useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import {UserDataView} from 'Common';
import {BottomGradient} from 'Common/components/BottomGradient';
import {getActiveUserData, getActiveUserProfilePhoto} from 'Module/Search/Search/store/searchSelectors';
import {UserProps} from 'Module/Search/Search/store/searchSlice';
import {ProfileCarousel} from 'Module/UserProfile/components/ProfileCarousel';
import {UserProfileAvatar} from 'Module/UserProfile/components/UserProfileAvatar';
import {UserProfileAvatarTitles} from 'Module/UserProfile/components/UserProfileAvatarTitles';
import {UserTags} from 'Module/UserProfile/components/UserTags';
import {colors} from 'Util/constants/colors';
import {rem, screenHeight, screenWidth, vrem} from 'Util/dimensions';
import {getAge} from 'Util/getAge';

export const UserProfileScroll = props => {
  const {profilePhotos, tags, onUserPhotoPress} = props;
  const insets = useSafeAreaInsets();
  const activeUser: UserProps = useSelector(getActiveUserData);
  const profilePhoto = useSelector(getActiveUserProfilePhoto);
  const {gallery, username, location, birth_date} = activeUser;
  const {photos, daily_stories} = gallery;
  const userAge = getAge(birth_date);

  const userLocation = location?.name || '';
  const sv = useSharedValue(0);

  const animatedView = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -sv.value}],
    };
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      sv.value = e.contentOffset.y;
    },
  });

  return (
    <>
      <Animated.View pointerEvents={'box-none'} style={[styles.avatarView, animatedView]}>
        <BottomGradient style={styles.gradient} />
        <View pointerEvents={'box-none'} style={[styles.storyButtonsStyle]}>
          <UserProfileAvatar
            onPress={onUserPhotoPress}
            source={profilePhoto}
            ellipseOn={daily_stories.length ? true : false}
          />
          <UserProfileAvatarTitles userName={username} userAge={userAge} userLocation={userLocation} />
        </View>
        {false && (
          <UserDataView
            onUserPhotoPress={onUserPhotoPress}
            photoStyle={styles.photoStyle}
            titlesContainer={styles.titlesContainer}
            containerStyle={styles.storyButtonsStyle}
            showButtons={false}
            userPhoto={profilePhoto}
            userName={username}
            userAge={userAge}
            userLocation={userLocation}
            ellipseOn={daily_stories.length ? true : false}
          />
        )}
      </Animated.View>
      <Animated.ScrollView
        bounces={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        showsVerticalScrollIndicator="false"
        stickyHeaderIndices={[0]}
        style={[styles.scroll, {bottom: 20 + insets.bottom + vrem(60)}]}>
        <View style={styles.carouselContainer}>
          <ProfileCarousel profilePhotos={profilePhotos} photos={photos} profilePhoto={profilePhoto} />
        </View>

        <UserTags containerStyles={styles.tags} tags={tags} />
        <View style={{height: vrem(18) * tags.length}}></View>
      </Animated.ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  avatarView: {
    position: 'absolute',
    top: screenHeight - vrem(507),
    height: 200,
    width: '100%',
    alignSelf: 'center',
    zIndex: 100,
  },
  gradient: {
    position: 'absolute',
    bottom: vrem(98),
    height: vrem(200),
    zIndex: 101,
  },
  scroll: {
    position: 'absolute',
    top: 0,
    width: screenWidth,
    height: vrem(654),
  },
  tags: {
    position: 'absolute',
    top: vrem(475),
    zIndex: 1050,
    width: screenWidth,
    paddingHorizontal: rem(30),
    backgroundColor: colors.black,
  },
  storyButtonsStyle: {
    position: 'absolute',
    top: 0,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
    zIndex: 102,
  },
  photoStyle: {
    height: rem(80),
    width: rem(80),
    borderRadius: rem(40),
    borderWidth: 1.5,
  },
  titlesContainer: {
    backgroundColor: colors.black,
    width: screenWidth,
    height: vrem(77),
    paddingTop: 10,
  },
  carouselContainer: {
    overflow: 'scroll',
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
  },
});
