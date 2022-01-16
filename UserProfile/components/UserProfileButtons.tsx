import React, {useCallback, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {OptionsPink} from 'Assets/icons';
import {AnimatedButton} from 'Common';
import {BottomGradient} from 'Common/components/BottomGradient';
import {PlayButton} from 'Module/UserProfile/components/PlayButton';
import {colors, hexToRGBA} from 'Util/constants/colors';
import {rem, screenWidth, vrem} from 'Util/dimensions';

interface UserProfileButtonsProps {
  onSkipPress: () => void;
  onLikePress: () => void;
  onOptionsPress: () => void;
  onPlayPress: () => void;
}

export const UserProfileButtons = (props: UserProfileButtonsProps) => {
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);
  const {onSkipPress, onLikePress, onOptionsPress, onPlayPress} = props;
  const onPlayPressLocal = useCallback(() => {
    setIsPlaying(!isPlaying);
    onPlayPress();
  }, [isPlaying, onPlayPress]);
  return (
    <View style={[styles.buttonsContainer, {paddingBottom: 20 + insets.bottom}]}>
      <PlayButton isPlaying={isPlaying} style={styles.smallButton} onPress={onPlayPressLocal} />
      <AnimatedButton startPulseAnimation={false} style={styles.button} onPress={onSkipPress} />
      <AnimatedButton isLike startPulseAnimation={false} style={styles.button} onPress={onLikePress} />
      <AnimatedButton
        imageStyle={styles.smallImage}
        source={OptionsPink}
        startPulseAnimation={false}
        style={styles.smallButton}
        onPress={onOptionsPress}
      />
      <BottomGradient style={styles.gradient} />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsContainer: {
    bottom: 0,
    width: screenWidth,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.black,
  },
  button: {
    marginHorizontal: rem(12),
    borderWidth: 1,
    borderColor: hexToRGBA(colors.white, 0.1),
  },
  smallButton: {
    height: vrem(52),
    width: vrem(52),
    borderRadius: vrem(26),
    marginHorizontal: rem(16),
    borderWidth: 1,
    borderColor: hexToRGBA(colors.white, 0.1),
  },
  smallImage: {
    width: vrem(28),
    height: vrem(28),
  },
  gradient: {
    top: -vrem(203),
    height: vrem(200),
  },
});
