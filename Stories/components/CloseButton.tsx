import React, {useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {Icon} from 'Assets/images';
import {rem} from 'Util/dimensions';

interface CloseButtonProps {
  onClose: () => void;
  videoIsRecording?: boolean;
}

export function CloseButton(props: CloseButtonProps) {
  const {onClose, videoIsRecording} = props;
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
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Icon.PNG name={'StoryCross'} style={styles.closeIcon} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: rem(16),
    top: rem(16),
    zIndex: 2000,
  },
  closeButton: {
    borderRadius: 32,
    height: 32,
    width: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
});
