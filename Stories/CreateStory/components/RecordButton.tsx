import * as React from 'react';
import {useCallback, useEffect, useRef, useState} from 'react';
import {Easing, Pressable, StyleSheet, Text, View} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';

import {screenWidth, vrem} from 'Util/dimensions';

interface RecordButtonProps {
  videoIsRecording: boolean;
  takePicture: () => void;
  takeVideo: () => void;
  stopRecording: () => void;
}

export const RecordButton = (props: RecordButtonProps) => {
  const {takePicture, takeVideo, stopRecording, videoIsRecording} = props;
  const outerValue = useSharedValue(70);
  const outerOpacity = useSharedValue('rgba(255, 255, 255, 0.1)');
  const innerValue = useSharedValue(62);
  const progressRef = useRef(null);
  const [timer, setTimer] = useState(0);
  const onLongPress = useCallback(() => {
    outerValue.value = 20;
    outerOpacity.value = 'rgba(255, 255, 255, 1)';
    innerValue.value = 140;
    takeVideo();
  }, [innerValue, outerOpacity, outerValue, takeVideo]);

  const onPressOut = useCallback(() => {
    outerValue.value = 70;
    outerOpacity.value = 'rgba(255, 255, 255, 0.1)';
    innerValue.value = 62;
    stopRecording();
  }, [outerValue, outerOpacity, innerValue, stopRecording]);

  useEffect(() => {
    if (videoIsRecording) {
      progressRef?.current?.animate(100, 15000, Easing.linear);
    }
  }, [videoIsRecording]);
  useEffect(() => {
    if (timer === 15) {
      setTimeout(() => {
        onPressOut();
      }, 500);
    }
  }, [onPressOut, timer]);

  const outerAnimatedStyles = useAnimatedStyle(() => {
    const opacity = withTiming(outerOpacity.value, {
      duration: 500,
    });
    return {
      backgroundColor: opacity,
      width: withTiming(outerValue.value, {
        duration: 500,
      }),
      height: withTiming(outerValue.value, {
        duration: 500,
      }),
    };
  }, []);

  const innerAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(innerValue.value, {
        duration: 500,
      }),
      height: withTiming(innerValue.value, {
        duration: 500,
      }),
    };
  }, []);

  const onAnimation = useCallback((fill: number) => {
    setTimer(Math.round(fill / (10 / 6 + 5)));
  }, []);

  return (
    <View style={styles.container}>
      {videoIsRecording && (
        <Text style={styles.timer}>
          0:{timer < 10 ? 0 : null}
          {timer} / 0:15
        </Text>
      )}
      <View style={styles.captureContainer}>
        <View style={styles.dimentionsContainer}>
          <Pressable onLongPress={onLongPress} onPress={takePicture} onPressOut={onPressOut}>
            <Animated.View style={[styles.capture, outerAnimatedStyles]}>
              <Animated.View style={[styles.innerCapture, innerAnimatedStyle]}></Animated.View>
            </Animated.View>
          </Pressable>
          {videoIsRecording && (
            <AnimatedCircularProgress
              style={{position: 'absolute'}}
              ref={progressRef}
              lineCap={'round'}
              size={106}
              width={6}
              fill={0}
              duration={1500}
              rotation={0}
              tintColor="#EB3F8D"
              backgroundColor="rgba(255, 255, 255, 0)"
              onFillChange={onAnimation}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 25,
    fontSize: 14,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  container: {
    position: 'absolute',
    bottom: 0,
  },
  captureContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
  },
  dimentionsContainer: {
    height: 140,
    width: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  capture: {
    height: 70,
    width: 70,
    backgroundColor: 'white',
    borderRadius: 70,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  innerCapture: {
    height: 62,
    width: 62,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 100,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0)',
  },
});
