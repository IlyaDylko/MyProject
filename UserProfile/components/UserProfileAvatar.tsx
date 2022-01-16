import React, {ReactElement} from 'react';
import {
  TouchableOpacity,
  GestureResponderEvent,
  StyleSheet,
  StyleProp,
  TextStyle,
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';

import {rem, vrem} from 'Util/dimensions';
import like from 'Assets/images/like.png';
import skip from 'Assets/images/skip.png';
import {colors, hexToRGBA} from 'Util/constants/colors';
import {Icon} from 'Assets/images';

interface ButtonProps {
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  source?: ImageSourcePropType;
  imageStyle?: StyleProp<ImageStyle>;
  ellipseOn?: boolean;
  startPulseAnimation?: boolean;
}

export const circlesDelay = [0, 1000, 2000, 3000, 4000, 5000];

export const UserProfileAvatar = ({style, onPress, source, imageStyle, ellipseOn}: ButtonProps): ReactElement => {
  const dis = ellipseOn === null ? false : !ellipseOn;
  return (
    <TouchableOpacity disabled={dis} style={[styles.buttonStyle, style]} onPress={onPress}>
      <ImageBackground source={source} style={[styles.image, imageStyle]} />
      {ellipseOn && <Icon.SVG name={'Ellipse'} style={styles.ellipse} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: vrem(80),
    width: vrem(80),
    borderRadius: vrem(40),
    backgroundColor: hexToRGBA(colors.black, 0.25),
  },
  image: {
    width: vrem(42),
    height: vrem(42),
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  ellipse: {
    position: 'absolute',
    height: rem(98),
    width: rem(98),
    top: -20.5,
  },
});
