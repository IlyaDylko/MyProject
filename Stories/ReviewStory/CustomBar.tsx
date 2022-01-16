import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Animated from 'react-native-reanimated';

import {Icon} from 'Assets/images';
import {screenWidth, vrem} from 'Util/dimensions';

interface SideBarProps {
  onPress?: () => void;
  visible?: boolean;
}

export function CustomBar(props: SideBarProps) {
  const {onPress, visible} = props;

  return (
    <>
      {visible && (
        <View style={styles.sideBar}>
          <View style={styles.switchCamera}>
            <TouchableOpacity onPress={onPress} style={styles.sideButton}>
              <Icon.PNG name={'Pencil'} style={styles.sideIcon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  sideBar: {
    position: 'absolute',
    right: screenWidth / 2 - 20,
    width: 40,
    bottom: vrem(16),
  },
  sideIcon: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchCamera: {
    height: 40,
    width: 40,
    borderRadius: 40,
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
});
