import React, {forwardRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import {BottomSheetCustom} from 'Common/BottomSheets';
import {rem} from 'Util/dimensions';
import {colors, hexToRGBA} from 'Util/constants/colors';
import {Icon} from 'Assets/images';

interface StoryVisibilitySheetProps {
  setIsPublic: (arg0: boolean) => void;
  isPublic: boolean;
  deleteStorie?: () => void;
}

export const StoryVisibilitySheet = forwardRef(({setIsPublic, isPublic}: StoryVisibilitySheetProps, ref) => {
  return (
    <BottomSheetCustom buttonText={'Done'} heightPercentage={'35%'} ref={ref}>
      <Text style={styles.popupTitle}>Visible for:</Text>
      <View style={styles.divider} />
      <TouchableOpacity onPress={() => setIsPublic(true)} style={styles.radioContainer}>
        <Icon.PNG name={isPublic ? 'RadioOn' : 'RadioOff'} style={styles.icon} />
        <View>
          <Text style={styles.title}>Public</Text>
          <Text style={styles.subTitle}>Visible to everyone seeing my profile and matches</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsPublic(false)} style={styles.radioContainer}>
        <Icon.PNG name={isPublic ? 'RadioOff' : 'RadioOn'} style={styles.icon} />
        <View>
          <Text style={styles.title}>Private</Text>
          <Text style={styles.subTitle}>Visible only to all my &quot;matches&quot;</Text>
        </View>
      </TouchableOpacity>
    </BottomSheetCustom>
  );
});

const styles = StyleSheet.create({
  radioContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: rem(20),
    paddingBottom: 10,
  },
  popupTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    paddingTop: 7,
    marginBottom: 16,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.white,
  },
  subTitle: {
    fontWeight: '400',
    fontSize: 12,
    color: hexToRGBA(colors.white, 0.5),
  },
  divider: {
    width: '100%',
    borderTopWidth: rem(1),
    borderColor: hexToRGBA(colors.white, 0.1),
  },
  icon: {
    height: 24,
    width: 24,
    marginRight: rem(10),
  },
});
