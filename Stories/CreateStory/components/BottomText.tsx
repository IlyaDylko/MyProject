import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {vrem} from 'Util/dimensions';
import {Text} from 'Common/index';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomTextProps {
  videoIsRecording: boolean;
}

export const BottomText = (props: BottomTextProps) => {
  const {videoIsRecording} = props;
  const insets = useSafeAreaInsets();
  const sv = useSharedValue(1);

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
      <Animated.View style={[styles.container, {marginBottom: insets.bottom}, animatedStyle]}>
        <Text style={styles.bottomText} text={'Tap to snap. Hold for video'} />
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontWeight: 'normal',
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
  },
});
