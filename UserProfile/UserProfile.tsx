import {StackActions, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import styles from './styles';

import {background} from 'Assets/images';
import {UserDataView} from 'Common';
import {UnmatchSheet} from 'Common/BottomSheets/UnmatchSheet';
import {BottomGradient} from 'Common/components/BottomGradient';
import {
  getActiveUserData,
  getActiveUserProfilePhoto,
  getActiveUserProfilePhotos,
} from 'Module/Search/Search/store/searchSelectors';
import {REACTION, setActiveUserIndex, setReaction, UserProps} from 'Module/Search/Search/store/searchSlice';
import {CloseButton} from 'Module/Stories/components';
import {ProfileCarousel} from 'Module/UserProfile/components/ProfileCarousel';
import {UserProfileButtons} from 'Module/UserProfile/components/UserProfileButtons';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {getAge} from 'Util/getAge';
import {UserTags} from 'Module/UserProfile/components/UserTags';
import {UserProfileScroll} from 'Module/UserProfile/components/UserProfileScroll';

export const UserProfile = () => {
  const unmatchRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const activeUser: UserProps = useSelector(getActiveUserData);
  const {id, gallery, username, location, birth_date, fan} = activeUser;
  const {photos, profile_stories, daily_stories, voice_introduction} = gallery;

  const profilePhotos = useSelector(getActiveUserProfilePhotos);
  const profilePhoto = useSelector(getActiveUserProfilePhoto);

  const tags = [
    'Text suggest',
    'Walking',
    'Sunset',
    'Text suggest',
    'Walking',
    'Sunset',
    'Text suggest',
    'Walking',
    'Sunset',
    'Text suggest',
    'Walking',
    'Sunset',
    'Text suggest',
    'Walking',
    'Sunset',
    'Text suggest',
    'Walking',
    'Sunset',
  ];

  const onLikePress = useCallback(() => {
    if (fan) {
      navigation.navigate(NAVIGATION_ROUTES.MATCH_MODAL, {
        userId: id,
        username: username,
        profilePhoto: gallery.photos && gallery.photos[0],
      });
    }

    const data = {
      user_id: id,
      reaction: REACTION.LIKED,
    };
    navigation.navigate(NAVIGATION_ROUTES.SEARCH);
    dispatch(setReaction(data));
    dispatch(setActiveUserIndex(1));
  }, [dispatch, fan, gallery.photos, id, navigation, username]);

  const onSkipPress = useCallback(() => {
    const data = {
      user_id: id,
      reaction: REACTION.DISLIKED,
    };
    navigation.navigate(NAVIGATION_ROUTES.SEARCH);
    dispatch(setReaction(data));
    dispatch(setActiveUserIndex(1));
  }, [dispatch, id, navigation]);

  const onOptionsPress = useCallback(() => {
    unmatchRef.current?.present();
  }, []);
  const onPlayPress = useCallback(() => {}, []);
  const onUnmatch = useCallback(() => {}, []);
  const onReport = useCallback(() => {}, []);
  const onUserPhotoPress = useCallback(() => {
    navigation.navigate(NAVIGATION_ROUTES.USER_DAILY_STORY);
  }, [navigation]);

  const onClose = useCallback(() => {
    navigation.dispatch(StackActions.pop(1));
  }, [navigation]);

  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <UserProfileScroll tags={tags} profilePhotos={profilePhotos} onUserPhotoPress={onUserPhotoPress} />
      <UserProfileButtons
        onOptionsPress={onOptionsPress}
        onPlayPress={onPlayPress}
        onLikePress={onLikePress}
        onSkipPress={onSkipPress}
      />
      <CloseButton onClose={onClose} />
      <UnmatchSheet onUnmatch={onUnmatch} onReport={onReport} ref={unmatchRef} />
    </View>
  );
};
