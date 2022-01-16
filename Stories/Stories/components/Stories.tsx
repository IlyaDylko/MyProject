import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {LongPressGestureHandler, State, TapGestureHandler} from 'react-native-gesture-handler';
import Video from 'react-native-video';

import {StoriesPhoto} from './StoriesPhoto';
import {ProgressBar} from './ProgressBar/ProgressBar';

import {rem, screenWidth} from 'Util/dimensions';

const defaultData = [
  {
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1555445091-5a8b655e8a4a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3Rvc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
  },
];

interface StoriesProps {
  isPaused?: boolean;
  activePhotos: {
    type: string;
    uri: string;
  }[];
  disableProgress?: boolean;
  setIndex?: (index: number) => void;
}

export function Stories(props: StoriesProps) {
  const {isPaused, activePhotos, disableProgress, setIndex} = props;
  const videoRef = useRef<Video>(null);
  const storyData = activePhotos.length ? activePhotos : defaultData;

  const [activeIndex, setActiveIndex] = useState(0);
  const [mediaReady, setMediaReady] = useState(false);
  const [videoLength, setVideoLength] = useState(3000);
  const [stopAnimation, setStopAnimation] = useState(false);
  const [shouldGoToTheBeginning, setShouldGoToTheBeginning] = useState(false);

  useEffect(() => {
    FastImage.preload(storyData);
  }, [storyData]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activePhotos]);

  useEffect(() => {
    if (setIndex) {
      setIndex(activeIndex);
    }
  }, [activeIndex, setIndex]);

  const nextIndex = useCallback(() => {
    if (activeIndex !== storyData.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, storyData.length]);
  const previousIndex = useCallback(() => {
    if (activeIndex !== 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      if (storyData[activeIndex].type === 'video') {
        videoRef?.current?.seek(0);
      }
      setShouldGoToTheBeginning(true);
    }
  }, [activeIndex, storyData]);
  const onScreenTap = useCallback(
    event => {
      if (event.nativeEvent.state === State.ACTIVE) {
        if (event.nativeEvent.x > screenWidth / 2) {
          nextIndex();
        } else {
          previousIndex();
        }
      }
    },
    [nextIndex, previousIndex],
  );
  const onScreenLongPress = useCallback(event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setStopAnimation(true);
    } else {
      setStopAnimation(false);
    }
  }, []);

  return (
    <LongPressGestureHandler onHandlerStateChange={onScreenLongPress}>
      <TapGestureHandler onHandlerStateChange={onScreenTap}>
        <View style={styles.container}>
          {!disableProgress && (
            <ProgressBar
              onAnimationEnd={nextIndex}
              activeIndex={activeIndex}
              data={storyData}
              duration={3000}
              mediaReady={mediaReady}
              videoLength={videoLength}
              stopAnimation={stopAnimation || isPaused}
              shouldGoToTheBeginning={shouldGoToTheBeginning}
              firstAnimationStartedCallback={() => setShouldGoToTheBeginning(false)}
            />
          )}
          {storyData[activeIndex]?.type === 'video' && (
            <Video
              ref={videoRef}
              source={{uri: storyData[activeIndex]?.uri}}
              style={styles.video}
              resizeMode={'contain'}
              onError={error => console.log('error', error)}
              onLoadStart={() => setMediaReady(false)}
              onLoad={({duration}) => setVideoLength(duration * 1000)}
              onReadyForDisplay={() => setMediaReady(true)}
              rate={1.0}
              ignoreSilentSwitch={'obey'}
            />
          )}
          {storyData[activeIndex]?.type === 'image' && (
            <StoriesPhoto
              uri={storyData[activeIndex]?.uri}
              activeIndex={activeIndex}
              onProgress={() => setMediaReady(false)}
              onLoad={() => setMediaReady(true)}
            />
          )}
          {!mediaReady && <ActivityIndicator size={'large'} />}
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: rem(24),
  },
  video: {
    height: '100%',
    width: '100%',
    borderTopRightRadius: rem(24),
    borderTopLeftRadius: rem(24),
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'stretch',
  },
  photo: {
    height: '100%',
    width: '100%',
    borderTopRightRadius: rem(24),
    borderTopLeftRadius: rem(24),
    position: 'absolute',
    bottom: 0,
    left: 0,
    alignItems: 'stretch',
    right: 0,
  },
});
