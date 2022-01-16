import * as React from 'react';
import {View, StyleSheet, Image, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {TouchableOpacity} from '@gorhom/bottom-sheet';

import {rem, vrem} from 'Util/dimensions';
import {colors} from 'Util/constants/colors';
import {background, Icon} from 'Assets/images';
import {Text} from 'Common';

interface StoriesHeaderProps {
  imageUri: string | null;
  userName?: string;
  lastOnline: string;
  onClose: () => void;
  onOptions: () => void;
}

export function StoriesHeader(props: StoriesHeaderProps) {
  const {imageUri, userName = 'Jhon jhonson', lastOnline = '2h ago', onClose, onOptions} = props;
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {paddingTop: Platform.OS === 'ios' ? insets.top + vrem(14) : vrem(14)}]}>
      <View style={styles.leftContainer}>
        <Image
          style={styles.image}
          source={
            imageUri
              ? {
                  uri: imageUri,
                }
              : background
          }
        />
        <View style={styles.titlesContainer}>
          <Text text={userName} />
          <Text style={styles.lastOnlineText} text={lastOnline} />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onOptions}>
          <Icon.SVG name={'Menu'} style={styles.menuIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Icon.SVG name={'WhiteCross'} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: rem(20),
    paddingVertical: vrem(14),
  },
  image: {
    height: 38,
    width: 38,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.dotColor,
  },
  leftContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  menuIcon: {
    width: 28,
    height: 28,
    marginRight: rem(20),
  },
  closeIcon: {
    width: 28,
    height: 28,
  },
  nameText: {
    fontSize: rem(14),
    lineHeight: 16,
  },
  lastOnlineText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.dotColor,
    fontWeight: 'normal',
  },
  titlesContainer: {
    marginLeft: rem(6),
  },
});
