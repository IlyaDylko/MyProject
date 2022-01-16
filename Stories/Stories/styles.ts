import {StyleSheet} from 'react-native';

import {colors, hexToRGBA} from 'Util/constants/colors';
import {rem} from 'Util/dimensions';

const colorScheme = [
  hexToRGBA(colors.black, 0),
  hexToRGBA(colors.black, 0.2),
  hexToRGBA(colors.black, 0.35),
  hexToRGBA(colors.black, 0.6),
  hexToRGBA(colors.black, 0.9),
  colors.black,
];

const disableColorScheme = [hexToRGBA(colors.white, 0), hexToRGBA(colors.white, 0)];

const gradientLocations = [0.64, 0.69, 0.74, 0.84, 0.94, 1];

const disableLocations = [0, 0];

export {colorScheme, disableColorScheme, gradientLocations, disableLocations};

export default StyleSheet.create({
  guideContainer: {flex: 1},
  linearGradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: rem(32),
    borderRadius: rem(30),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: hexToRGBA(colors.main, 0.5),
  },
  title: {
    fontSize: rem(32),
    textAlign: 'center',
    lineHeight: rem(38),
    margin: rem(16),
  },
  description: {
    fontSize: rem(14),
    textAlign: 'center',
    lineHeight: rem(21),
    fontWeight: '400',
  },
  safeAreaGradient: {
    marginHorizontal: 0,
  },
  howToSearchButton: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
