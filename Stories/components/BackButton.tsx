import * as React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';

import {Icon} from 'Assets/images';
import {rem} from 'Util/dimensions';

interface CloseButtonProps {
  onBack: () => void;
}

export function BackButton(props: CloseButtonProps) {
  const {onBack} = props;
  return (
    <TouchableOpacity onPress={onBack} style={styles.closeButton}>
      <Icon.PNG name={'Back'} style={styles.closeIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    left: rem(16),
    top: rem(16),
    borderRadius: 32,
    height: 32,
    width: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 18,
    height: 18,
  },
});
