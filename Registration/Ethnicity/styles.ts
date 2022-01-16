import {Platform, StyleSheet} from 'react-native';

import {colors} from 'Util/constants/colors';
import {rem, vrem} from 'Util/dimensions';

export default StyleSheet.create({
  titleWrapper: {
    marginTop: vrem(32),
    marginBottom: vrem(40),
  },
  title: {
    fontSize: rem(32),
    color: colors.white,
    lineHeight: rem(38),
    letterSpacing: rem(-0.03),
    marginBottom: vrem(16),
  },
  button: {
    height: 56,
    width: rem(313),
    backgroundColor: colors.background,
    marginBottom: vrem(4),
    borderRadius: rem(8),
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: '400',
  },
  buttonSelected: {
    width: rem(313),
    backgroundColor: colors.main,
    marginBottom: vrem(8),
    marginTop: vrem(4),
    paddingVertical: 17,
    borderRadius: rem(8),
    justifyContent: 'center',
  },
  buttonSelectedText: {
    marginLeft: rem(16),
    fontWeight: '600',
  },
  buttonSelectedSubText: {
    width: rem(200),
    fontSize: rem(13),
    marginLeft: Platform.OS === 'ios' ? 0 : rem(4),
    fontWeight: '400',
  },
  subTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: vrem(16),
  },
});
