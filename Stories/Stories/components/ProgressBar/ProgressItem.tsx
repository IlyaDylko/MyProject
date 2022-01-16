import * as React from 'react';
import {useCallback, useLayoutEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface ProgressItemProps {
  shouldGoToTheBeginning: boolean;
  firstAnimationStartedCallback: () => void;
  stopAnimation: boolean;
  duration: number;
  width: number;
  activeIndex: number;
  index: number;
  onAnimationEnd: () => void;
  mediaReady: boolean;
  storyData: {type: string; uri: string};
  videoLength: number;
}

export function ProgressItem(props: ProgressItemProps) {
  const {
    shouldGoToTheBeginning,
    firstAnimationStartedCallback,
    duration,
    width,
    activeIndex,
    index,
    onAnimationEnd,
    mediaReady,
    storyData,
    videoLength,
    stopAnimation,
  } = props;
  const isActive = index === activeIndex;
  const childWidth = useSharedValue(0);

  const startAnimation = useCallback(() => {
    childWidth.value = withTiming(
      width,
      {
        duration: storyData.type === 'video' ? videoLength : duration,
        easing: Easing.linear,
      },
      isFinished => {
        if (isFinished) {
          runOnJS(onAnimationEnd)();
        }
      },
    );
  }, [childWidth, duration, onAnimationEnd, storyData.type, videoLength, width]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      width: childWidth.value,
    };
  }, [isActive, mediaReady]);

  useLayoutEffect(() => {
    // main animation handler
    if (!stopAnimation) {
      if (isActive && mediaReady) {
        startAnimation();
      } else {
        childWidth.value = 0;
      }
    } else if (stopAnimation) {
      cancelAnimation(childWidth);
    }
  }, [childWidth, isActive, mediaReady, startAnimation, stopAnimation]);

  useLayoutEffect(() => {
    // first story handler
    if (shouldGoToTheBeginning) {
      childWidth.value = 0;
      if (isActive && mediaReady) {
        startAnimation();
        firstAnimationStartedCallback(); // to restart the shouldGoToTheBeginning pointer
      }
    }
  }, [childWidth, firstAnimationStartedCallback, isActive, mediaReady, shouldGoToTheBeginning, startAnimation]);

  return (
    <View style={[styles.mainParent, {width, backgroundColor: index < activeIndex ? 'white' : 'rgba(0, 0, 0, 0.3)'}]}>
      <Animated.View style={[styles.mainChild, animatedStyles]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainParent: {
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    height: 4,
  },
  mainChild: {
    borderRadius: 20,
    backgroundColor: 'white',
    height: 4,
    width: 0,
  },
});
