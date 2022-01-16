import {StyleSheet} from 'react-native';

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
  hint: {
    fontSize: rem(14),
    color: colors.dotColor,
    lineHeight: vrem(21),
    fontWeight: 'normal',
  },
  itemWrapper: {
    backgroundColor: colors.background,
    marginRight: rem(16),
    height: 182,
    width: 129,
    borderRadius: rem(12),
    borderStyle: 'dashed',
    borderWidth: rem(1),
    borderColor: colors.main,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 182,
    width: 129,
    alignSelf: 'center',
    borderRadius: rem(12),
  },
  buttonWrapper: {
    marginBottom: vrem(24),
    width: rem(247),
    alignSelf: 'center',
  },
  icon: {
    height: vrem(50),
    width: rem(50),
  },
});
