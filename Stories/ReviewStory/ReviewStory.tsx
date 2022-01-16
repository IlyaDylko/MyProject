import BottomSheet from '@gorhom/bottom-sheet';
import CameraRoll from '@react-native-community/cameraroll';
import {StackActions, useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNFFmpeg, RNFFmpegConfig, RNFFprobe} from 'react-native-ffmpeg';
import RNFS from 'react-native-fs';
import {PhotoEditorModal} from 'react-native-photoeditorsdk';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Toast from 'react-native-simple-toast';
import {VideoEditorModal} from 'react-native-videoeditorsdk';
import {useDispatch, useSelector} from 'react-redux';

import {NAVIGATION_ROUTES} from '../../../Navigation/routes';
import {BackButton, CloseButton, StoryVisibilitySheet} from '../components';
import {addDailyStory, addProfileStory} from '../store/storiesSlice';
import {CustomBar} from './CustomBar';
import {DownloadButton} from './DownloadButton';

import {colors, hexToRGBA} from 'Util/constants/colors';
import {DataStates} from 'Util/constants/dataState.enum';
import {photoEditorConfig} from 'Util/constants/photoEditorConfig';
import {videoEditorConfig} from 'Util/constants/videoEditorConfig';
import {rem, screenWidth} from 'Util/dimensions';
import {selectStoriesDataState} from 'Module/Stories/store/storiesSelectors';
import {StoryMedia} from 'Module/Stories/ReviewStory/components/StoryMedia';
import {getUser} from 'Module/Profile/store/slices';
import {PrimaryButton} from 'Common/index';
import {DeleteStorySheet} from 'Common/BottomSheets/DeleteStorySheet';

interface ItemProps {
  type: string;
  videoPath?: string;
  imagePath?: string;
}
interface ReviewStoryScreenProps {
  items: ItemProps[];
  storyType: string;
}

const ReviewStory = () => {
  const {navigate} = useNavigation();
  const deleteStorySheetRef = useRef<BottomSheet>();
  const storyVisibilitySheetRef = useRef();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const storiesDataState = useSelector(selectStoriesDataState);
  const {storyType, items}: ReviewStoryScreenProps = route.params;
  const [isPublic, setIsPublic] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mediaItems, setMediaItems] = useState(items);
  const [photoEditorVisible, setPhotoEditorVisible] = useState(false);
  const [videoEditorVisible, setVideoEditorVisible] = useState(false);
  const isLoading = storiesDataState === DataStates.Pending;

  useFocusEffect(
    useCallback(() => {
      RNFFmpegConfig.disableLogs();
      let chunksNumber = 0;
      (async () => {
        if (items?.length > 1) {
          const newItems = [];
          for (const i in items) {
            if (items[i]?.type === 'video') {
              const video = items[i].videoPath;
              await RNFFmpeg.execute(
                `-i ${video} -ss 00:00:00 -to 00:00:15 -y ${RNFS.CachesDirectoryPath}/storyVideoFirst15sec${i}.mp4`,
              ).then(async result => {
                if (result === 0) {
                  await RNFFmpeg.execute(
                    `-i ${RNFS.CachesDirectoryPath}/storyVideoFirst15sec${i}.mp4 -vframes 1 -f image2 -y ${RNFS.CachesDirectoryPath}/storyVideoFirst15sec${i}.jpeg`,
                  ).then(result => console.log(`photo ${i} done`, result));
                  newItems.push({
                    type: 'video',
                    videoPath: `${RNFS.CachesDirectoryPath}/storyVideoFirst15sec${i}.mp4`,
                    imagePath: `${RNFS.CachesDirectoryPath}/storyVideoFirst15sec${i}.jpeg`,
                  });
                }
              });
            }
            if (items[i]?.type === 'image') {
              newItems.push(items[i]);
            }
          }
          setMediaItems(newItems);
        }
        // if only video
        if (items?.length === 1 && items[0]?.type === 'video') {
          const video = items[0].videoPath;
          RNFFmpegConfig.disableLogs();
          RNFFprobe.getMediaInformation(video).then(information => {
            if (information.getMediaProperties() !== undefined) {
              if (information.getMediaProperties().duration !== undefined) {
                const chunkDefaultDuration = 15;
                const duration = Number(information.getMediaProperties().duration);
                if (duration >= chunkDefaultDuration) {
                  chunksNumber = Math.ceil(duration / chunkDefaultDuration);
                  const newArray: ItemProps[] = [];
                  RNFFmpeg.execute(
                    `-i ${video} -c copy -map 0 -segment_time 00:00:${chunkDefaultDuration} -f segment -reset_timestamps 1 ${RNFS.CachesDirectoryPath}/output%1d.mp4`,
                  ).then(async result => {
                    if (result === 0) {
                      for (let i = 0; i < chunksNumber; i++) {
                        await RNFFmpeg.execute(
                          `-i ${RNFS.CachesDirectoryPath}/output${i}.mp4 -vframes 1 -f image2 -y ${RNFS.CachesDirectoryPath}/imgOutput${i}.jpeg`,
                        );
                        newArray.push({
                          type: 'video',
                          videoPath: `${RNFS.CachesDirectoryPath}/output${i}.mp4`,
                          imagePath: `file://${RNFS.CachesDirectoryPath}/imgOutput${i}.jpeg`,
                        });
                      }
                      setMediaItems(newArray);
                    }
                  });
                }
              }
            }
          });
        }
      })();
    }, [items]),
  );

  const onEditPress = useCallback(() => {
    if (mediaItems[selectedIndex].type === 'video') {
      setVideoEditorVisible(true);
    } else {
      setPhotoEditorVisible(true);
    }
  }, [mediaItems, selectedIndex]);

  const onOptions = useCallback(() => {
    storyVisibilitySheetRef.current?.present();
  }, []);
  const onLongPress = useCallback(index => {
    setSelectedIndex(index);
    deleteStorySheetRef.current?.present();
  }, []);
  const onPhotoEditorExport = useCallback(
    result => {
      const newItems = [...mediaItems];
      newItems[selectedIndex] = {type: 'image', imagePath: result.image};
      setMediaItems(newItems);
      setPhotoEditorVisible(false);
    },
    [mediaItems, selectedIndex],
  );
  const onPhotoEditorCancel = useCallback(() => {
    setPhotoEditorVisible(false);
  }, []);
  const onVideoEditorExport = useCallback(
    async result => {
      const newItems = [...mediaItems];
      await RNFFmpeg.execute(
        `-i ${result.video} -vframes 1 -f image2 -y ${RNFS.CachesDirectoryPath}/edditedVideo${selectedIndex}.jpeg`,
      );
      newItems[selectedIndex] = {
        type: 'video',
        videoPath: result.video,
        imagePath: `${RNFS.CachesDirectoryPath}/edditedVideo${selectedIndex}.jpeg`,
      };
      setMediaItems(newItems);
      setVideoEditorVisible(false);
    },
    [mediaItems, selectedIndex],
  );
  const onVideoEditorCancel = useCallback(() => {
    setVideoEditorVisible(false);
  }, []);
  const deleteStory = useCallback(() => {
    const items = [...mediaItems];
    const newItems = items.filter(item => item !== mediaItems[selectedIndex]);
    if (selectedIndex) {
      setSelectedIndex(selectedIndex - 1);
    }
    setMediaItems(newItems);
    deleteStorySheetRef?.current?.close();
  }, [mediaItems, selectedIndex]);

  const onDownload = useCallback(async () => {
    let granted = false;
    if (Platform.OS === 'android') {
      const permissionRequestResult = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      granted = permissionRequestResult === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      granted = true;
    }
    if (granted) {
      const path =
        mediaItems[selectedIndex].type === 'video'
          ? mediaItems[selectedIndex].videoPath
          : mediaItems[selectedIndex].imagePath;
      CameraRoll.save(path).then(() => Toast.show('Media saved'));
    }
  }, [mediaItems, selectedIndex]);

  const onShare = useCallback(async () => {
    const data = new FormData();
    mediaItems.forEach(element => {
      const newFile = {
        name: element.type === 'image' ? 'image.jpg' : 'video.mp4',
        uri: element.type === 'image' ? element.imagePath : element.videoPath,
        type: element.type === 'image' ? 'image/jpg' : 'video/mp4',
      };
      data.append('files', newFile);
    });
    storyType === 'profile' ? await dispatch(addProfileStory(data)) : await dispatch(addDailyStory(data));
    dispatch(getUser());
    navigate(NAVIGATION_ROUTES.SEARCH);
  }, [dispatch, mediaItems, navigate, storyType]);

  const androidStatusBar = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

  return (
    <View style={styles.container}>
      <View style={{marginTop: insets.top + 15}}>
        <PhotoEditorModal
          configuration={photoEditorConfig}
          onExport={onPhotoEditorExport}
          onCancel={onPhotoEditorCancel}
          visible={photoEditorVisible}
          image={mediaItems[selectedIndex].imagePath}
        />
        <VideoEditorModal
          configuration={videoEditorConfig}
          onExport={onVideoEditorExport}
          onCancel={onVideoEditorCancel}
          visible={videoEditorVisible}
          video={mediaItems[selectedIndex].videoPath}
        />
        <StoryMedia
          type={mediaItems[selectedIndex].type}
          uri={
            mediaItems[selectedIndex].type === 'video'
              ? mediaItems[selectedIndex].videoPath
              : mediaItems[selectedIndex].imagePath
          }
        />
        <CustomBar onPress={onEditPress} visible={true} />
        <BackButton onBack={() => navigation.goBack()} />
        <CloseButton onClose={() => navigation.dispatch(StackActions.pop(2))} />
      </View>
      <View style={[styles.bottomView, {marginBottom: insets.bottom}]}>
        <View style={styles.scrollViewContainer}>
          <ScrollView horizontal style={styles.smallPhotosContainer} contentContainerStyle={{alignItems: 'center'}}>
            {mediaItems &&
              mediaItems.length > 1 &&
              mediaItems.map((image, index) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIndex(index);
                  }}
                  onLongPress={() => onLongPress(index)}
                  key={index}>
                  <Image source={{uri: image.imagePath}} style={styles.smallPhoto} />
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
        {mediaItems.length === 1 && <DownloadButton onDownload={onDownload} />}
        <View style={styles.bottomButtonsContainer}>
          <>
            <PrimaryButton
              textStyle={styles.primaryButtonText}
              wrapperStyle={styles.primaryButtonContainer}
              onPress={onShare}
              isLoading={isLoading}
              text={storyType === 'daily' ? 'Publish' : 'Share'}
            />
            {storyType === 'daily' && (
              <PrimaryButton
                wrapperStyle={styles.primaryButtonOptions}
                onPress={onOptions}
                icon={'ChevroneDown'}
                iconStyle={styles.icon}
              />
            )}
          </>
        </View>
      </View>
      <StoryVisibilitySheet setIsPublic={setIsPublic} isPublic={isPublic} ref={storyVisibilitySheetRef} />
      <DeleteStorySheet deleteStory={deleteStory} ref={deleteStorySheetRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  bottomButtonsContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },
  primaryButtonContainer: {
    paddingHorizontal: 16,
    height: 40,
  },
  primaryButtonOptions: {
    width: rem(40),
    height: 40,
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  primaryButtonText: {
    fontSize: 14,
  },
  scrollViewContainer: {
    width: screenWidth * 0.75,
  },
  smallPhotosContainer: {
    marginLeft: rem(12),
  },
  smallPhoto: {
    height: 52,
    width: 37,
    borderRadius: 8,
    marginLeft: 8,
  },
  popupTitle: {
    fontWeight: '600',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    paddingTop: 20,
    marginBottom: 15,
  },
  popupText: {
    width: screenWidth * 0.7,
    alignSelf: 'center',
    fontSize: 14,
    color: hexToRGBA(colors.white, 0.5),
    textAlign: 'center',
    marginBottom: 40,
  },
  bottomView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 16,
  },
});

export default ReviewStory;
