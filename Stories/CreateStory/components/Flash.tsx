import * as React from 'react';
import {useEffect} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withSequence, withTiming} from 'react-native-reanimated';

import {screenHeight, screenWidth} from 'Util/dimensions';

interface FlashProps {
  shouldUseFlash: boolean;
}

export function Flash(props: FlashProps) {
  const {shouldUseFlash} = props;
  const sv = useSharedValue(0);

  useEffect(() => {
    if (shouldUseFlash) {
      sv.value = withSequence(withTiming(1), withTiming(0));
    }
  }, [shouldUseFlash, sv]);

  const style = useAnimatedStyle(() => {
    return {
      opacity: sv.value,
    };
  });

  return <Animated.View pointerEvents={'box-none'} style={[styles.flash, style]} />;
}

const styles = StyleSheet.create({
  flash: {
    backgroundColor: 'white',
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
  },
});
