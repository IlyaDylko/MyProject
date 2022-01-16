import {useNavigation, StackActions, useRoute} from '@react-navigation/native';
import * as React from 'react';
import {useCallback, useRef, useState} from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {launchImageLibrary} from 'react-native-image-picker';
import {useDispatch, useSelector} from 'react-redux';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';

import {addStoriesPhoto} from '../store/storiesSlice';
import {Flash, RecordButton, SideBar} from './components';
import {BottomText} from './components/BottomText';
import {GalleryButton} from './components/GalleryButton';

import {CloseButton} from 'Module/Stories/components/CloseButton';
import {screenHeight, screenWidth} from 'Util/dimensions';
import {NAVIGATION_ROUTES} from 'Navigation/routes';
import {selectProfileStories} from 'Module/Profile/store/selectors';

interface CreateStoryScreenProps {
  storyType?: string;
}

const CreateStory = () => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [cameraBack, setCameraBack] = useState(false);
  const [filtersOn, setFiltersOn] = useState(false);
  const [videoIsRecording, setVideoIsRecording] = useState(false);
  const [photoIsBeenTaken, setPhotoIsBeenTaken] = useState(false);
  const stories = useSelector(selectProfileStories);
  const mediaLimit = stories ? 9 - stories.length : 9;
  const {storyType}: CreateStoryScreenProps = route.params!;

  const reviewStoryCameraVideo = useCallback(
    items => {
      navigation.navigate(NAVIGATION_ROUTES.REVIEW_STORY, {items, storyType});
    },
    [navigation, storyType],
  );
  const reviewStoryGalleryPhoto = useCallback(
    items => {
      navigation.navigate(NAVIGATION_ROUTES.REVIEW_STORY, {items, storyType});
    },
    [navigation, storyType],
  );

  const takeVideo = useCallback(async () => {
    if (cameraRef?.current) {
      const options = {quality: 0.5, base64: true, maxDuration: 15000};
      setVideoIsRecording(true);
      const data = await cameraRef?.current?.recordAsync(options);
      if (data) {
        reviewStoryCameraVideo([{videoPath: data.uri, type: 'video'}]);
      }
    }
  }, [reviewStoryCameraVideo]);

  const stopRecording = useCallback(async () => {
    if (cameraRef?.current && videoIsRecording) {
      await cameraRef?.current?.stopRecording();
      setVideoIsRecording(false);
    }
  }, [videoIsRecording]);

  const takePicture = useCallback(async () => {
    if (cameraRef?.current) {
      setPhotoIsBeenTaken(true);
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef?.current?.takePictureAsync(options);
      dispatch(addStoriesPhoto(data.uri));
      setPhotoIsBeenTaken(false);
      reviewStoryGalleryPhoto([{imagePath: data.uri, type: 'image'}]);
    }
  }, [dispatch, reviewStoryGalleryPhoto]);

  const onGalleryPress = useCallback(() => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: mediaLimit,
      },
      result => {
        if (result.assets) {
          if (result.assets.length > mediaLimit) {
            Toast.show(`You can upload only ${mediaLimit} more stories.`);
          } else {
            const items = result.assets;
            const newItems = [];
            for (const i in items) {
              newItems.push({});
              if (items[i].duration) {
                newItems[i].type = 'video';
                newItems[i].videoPath = items[i].uri;
              } else {
                newItems[i].type = 'image';
                newItems[i].imagePath = items[i].uri;
              }
            }
            reviewStoryGalleryPhoto(newItems);
          }
        }
      },
    );
  }, [mediaLimit, reviewStoryGalleryPhoto]);

  const onFlashPress = useCallback(() => {
    setFlashEnabled(!flashEnabled);
  }, [flashEnabled]);

  const onSwitchCameraPress = useCallback(() => {
    setCameraBack(!cameraBack);
  }, [cameraBack]);

  const onFiltersPress = useCallback(() => {
    setFiltersOn(!filtersOn);
  }, [filtersOn]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
    },
    preview: {
      height: screenHeight - 59 - insets.top - insets.bottom - 15 - StatusBar.currentHeight,
      width: screenWidth,
      borderRadius: 24,
      overflow: 'hidden',
      marginTop: insets.top + 15,
    },
    camera: {
      height: screenHeight - 59 - insets.top - insets.bottom - 15 - StatusBar.currentHeight,
      width: screenWidth,
    },
  });

  return (
    <View style={styles.container}>
      <View style={[styles.preview, {marginTop: insets.top + 15}]}>
        <RNCamera
          ref={cameraRef}
          style={[styles.camera]}
          defaultVideoQuality={RNCamera.Constants.VideoQuality['720p']}
          type={cameraBack ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
          flashMode={flashEnabled ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}>
          <CloseButton videoIsRecording={videoIsRecording} onClose={() => navigation.dispatch(StackActions.pop(1))} />
          <SideBar
            videoIsRecording={videoIsRecording}
            onSwitchCameraPress={onSwitchCameraPress}
            onFlashPress={onFlashPress}
            onFiltersPress={onFiltersPress}
            flashEnabled={flashEnabled}
            filtersOn={filtersOn}
          />
          <GalleryButton videoIsRecording={videoIsRecording} onGalleryPress={onGalleryPress} />
          <RecordButton
            videoIsRecording={videoIsRecording}
            stopRecording={stopRecording}
            takeVideo={takeVideo}
            takePicture={takePicture}
          />
        </RNCamera>
      </View>
      <BottomText videoIsRecording={videoIsRecording} />
      {flashEnabled && !cameraBack && <Flash shouldUseFlash={photoIsBeenTaken} />}
    </View>
  );
};

export default CreateStory;
