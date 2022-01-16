import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors} from 'Util/constants/colors';
import {rem, vrem} from 'Util/dimensions';

export const UserTags = props => {
  const {tags, containerStyles} = props;
  return (
    <>
      {tags && (
        <View style={[styles.userTagsContainer, containerStyles]}>
          {tags.map((item, index) => (
            <View key={index} style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{item}</Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  userTagsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  selectedItemText: {
    color: colors.main,
    fontSize: rem(14),
    lineHeight: rem(16),
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingVertical: vrem(8),
    paddingHorizontal: rem(6),
    borderColor: colors.main,
    borderRadius: rem(4),
    marginHorizontal: rem(4),
    marginVertical: vrem(4),
  },
});
