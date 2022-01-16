import {StyleSheet} from 'react-native';

import {colors, hexToRGBA} from 'Util/constants/colors';
import {rem, screenWidth, vrem} from 'Util/dimensions';

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontSize: rem(32),
    lineHeight: vrem(38),
    letterSpacing: rem(-0.03),
    fontWeight: '600',
    // TODO: Add fontFamily: 'Poppins'
  },
  mainButtonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  popupTitle: {
    fontWeight: '600',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    paddingTop: 20,
    marginBottom: 15,
  },
  popupText: {
    width: screenWidth * 0.7,
    alignSelf: 'center',
    fontSize: 14,
    color: hexToRGBA(colors.white, 0.5),
    textAlign: 'center',
    marginBottom: 40,
  },
});

export default styles;
