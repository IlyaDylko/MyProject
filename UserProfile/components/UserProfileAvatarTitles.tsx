import React from 'react';
import {View, StyleSheet, Image} from 'react-native';

import {Text} from 'Common';
import {colors, hexToRGBA} from 'Util/constants/colors';
import {rem, vrem} from 'Util/dimensions';
import marker from 'Assets/images/map-marker.png';

export const UserProfileAvatarTitles = props => {
  const {userName, userAge, userLocation} = props;
  return (
    <View style={styles.titles}>
      <Text text={userName + ', ' + userAge} style={styles.appName} />
      <View style={styles.destination}>
        <Image source={marker} style={styles.marker} />
        <Text text={userLocation} style={styles.smallText} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titles: {
    alignItems: 'center',
  },
  appName: {
    fontSize: rem(20),
    lineHeight: vrem(24),
    marginBottom: vrem(4),
  },
  destination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallText: {
    fontSize: rem(15),
    lineHeight: vrem(16),
    fontWeight: '400',
    color: hexToRGBA(colors.white, 0.7),
  },
  marker: {
    resizeMode: 'cover',
    width: rem(16),
    height: rem(16),
    marginRight: rem(2),
  },
});
