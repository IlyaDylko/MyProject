import React, {useCallback, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated, {useAnimatedStyle, useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated';

import {Icon} from 'Assets/images';
import {screenHeight} from 'Util/dimensions';

interface SideBarProps {
  onSwitchCameraPress: () => void;
  onFlashPress: () => void;
  onFiltersPress: () => void;
  flashEnabled: boolean;
  filtersOn: boolean;
  videoIsRecording: boolean;
}

export function SideBar(props: SideBarProps) {
  const {onSwitchCameraPress, onFlashPress, onFiltersPress, flashEnabled, filtersOn, videoIsRecording} = props;
  const isOpen = useSharedValue(false);

  const rotateZ = useDerivedValue(() => {
    return withTiming(isOpen.value ? 180 : 0, {
      duration: 500,
    });
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotateZ.value}deg`}],
    };
  });
  const onSwitchPress = useCallback(() => {
    isOpen.value = !isOpen.value;
    onSwitchCameraPress();
  }, [isOpen, onSwitchCameraPress]);

  const x = useSharedValue(8);

  const slideRight = useAnimatedStyle(() => {
    return {
      right: withTiming(x.value, {
        duration: 300,
      }),
    };
  }, []);

  useEffect(() => {
    if (videoIsRecording) {
      x.value = -40;
    } else {
      x.value = 8;
    }
  }, [x, videoIsRecording]);

  return (
    <Animated.View style={[styles.sideBar, slideRight]}>
      <View style={styles.switchCamera}>
        <Animated.View style={[styles.animatedCamera, animatedStyle]}>
          <TouchableOpacity onPress={onSwitchPress} style={styles.sideButton}>
            <Icon.PNG name={'SwitchCamera'} style={styles.sideIcon} />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View style={styles.flash}>
        <TouchableOpacity onPress={onFlashPress} style={[styles.sideButton]}>
          <Icon.PNG name={flashEnabled ? 'FlashEnabled' : 'FlashDisabled'} style={styles.sideIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.filters}>
        <TouchableOpacity onPress={onFiltersPress} style={styles.sideButton}>
          <Icon.PNG name={filtersOn ? 'FiltersYellow' : 'Filters'} style={styles.sideIcon} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  sideBar: {
    position: 'absolute',
    right: 8,
    height: 136,
    width: 40,
    top: screenHeight * 0.36,
  },
  sideIcon: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCamera: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchCamera: {
    height: 40,
    width: 40,
    borderTopStartRadius: 40,
    borderTopEndRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  sideButton: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flash: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  filters: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
