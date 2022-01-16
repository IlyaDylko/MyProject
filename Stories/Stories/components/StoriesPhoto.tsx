import FastImage from 'react-native-fast-image';
import * as Animatable from 'react-native-animatable';
import {StyleSheet} from 'react-native';
import React, {useRef, useCallback, useLayoutEffect} from 'react';

import {rem} from 'Util/dimensions';
import {usePrevious} from 'Util/hooks';

interface StoriesPhotoProps {
  uri: string;
  activeIndex: number;
  onProgress: () => void;
  onLoad: () => void;
}

export function StoriesPhoto(props: StoriesPhotoProps) {
  const {uri, activeIndex, onProgress, onLoad} = props;
  const photoViewRef = useRef(null);
  const prevIndex = usePrevious(activeIndex);
  const fadeIn = useCallback(() => {
    if (activeIndex > prevIndex) {
      photoViewRef?.current?.fadeInRight();
    } else {
      photoViewRef?.current?.fadeInLeft();
    }
  }, [activeIndex, prevIndex]);
  useLayoutEffect(() => {
    fadeIn();
  }, [fadeIn]);
  return (
    <Animatable.View ref={photoViewRef} style={styles.photo}>
      <FastImage
        style={styles.photo}
        resizeMode={'contain'}
        source={{
          uri,
        }}
        onProgress={onProgress}
        onLoad={onLoad}
      />
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
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
