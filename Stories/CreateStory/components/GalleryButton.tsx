import React, {useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {Icon} from 'Assets/images';
import {rem} from 'Util/dimensions';

interface GalleryButtonProps {
  videoIsRecording: boolean;
  onGalleryPress: () => void;
}

export function GalleryButton(props: GalleryButtonProps) {
  const {videoIsRecording, onGalleryPress} = props;
  const sv = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(sv.value, {
        duration: 300,
      }),
    };
  }, []);

  useEffect(() => {
    if (videoIsRecording) {
      sv.value = 0;
    } else {
      sv.value = 1;
    }
  }, [sv, videoIsRecording]);

  return (
    <>
      <Animated.View style={[styles.gallery, animatedStyle]}>
        <TouchableOpacity onPress={onGalleryPress}>
          <Icon.PNG name={'Gallery'} style={styles.gelleryIcon} />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  gallery: {
    position: 'absolute',
    left: rem(57),
    bottom: 39,
    zIndex: 1,
  },
  gelleryIcon: {
    height: 40,
    width: 40,
  },
});
