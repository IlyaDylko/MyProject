import {StyleSheet} from 'react-native';

import {colors} from 'Util/constants/colors';
import {rem, vrem, screenHeight, screenWidth} from 'Util/dimensions';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    position: 'absolute',
    overflow: 'scroll',
    borderRadius: 24,
  },
  middleElementContainer: {
    position: 'absolute',
    justifyContent: 'center',
    width: screenWidth,
    zIndex: 101,
  },
});
