import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

import {Icon} from 'Assets/images';

interface ShareButtonProps {
  onDownload: () => void;
}

export const DownloadButton = (props: ShareButtonProps) => {
  const {onDownload} = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onDownload}>
      <Icon.PNG name={'Download'} style={styles.sideIcon} />
      <Text style={styles.text}>Save</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    left: 24,
  },
  sideIcon: {
    width: 20,
    height: 20,
  },
  text: {
    color: 'white',
    fontSize: 12,
    lineHeight: 18,
  },
});
