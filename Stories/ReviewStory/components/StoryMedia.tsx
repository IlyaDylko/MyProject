import React, {useMemo} from 'react';
import {Image, StatusBar, StyleSheet, StyleProp, ImageStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Video from 'react-native-video';

import {screenHeight, screenWidth} from 'Util/dimensions';

interface StoryMediaProps {
  type: string;
  uri: string | undefined;
  style?: StyleProp<ImageStyle>;
}

export const StoryMedia = (props: StoryMediaProps) => {
  const {type, uri, style} = props;
  const insets = useSafeAreaInsets();
  const androidStatusBar = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
  const containerStyles = useMemo(() => {
    return StyleSheet.create({
      photo: {
        height: screenHeight - 79 - insets.top - insets.bottom - 15 - androidStatusBar,
        width: screenWidth,
        borderRadius: 24,
      },
      video: {
        height: screenHeight - 79 - insets.top - insets.bottom - 15 - androidStatusBar,
        width: screenWidth,
        borderRadius: 24,
      },
    });
  }, [androidStatusBar, insets.bottom, insets.top]);

  return (
    <>
      {type === 'video' && (
        <Video
          source={{uri}}
          style={[containerStyles.video, style]}
          resizeMode={'contain'}
          repeat={true}
          rate={1.0}
          ignoreSilentSwitch={'obey'}
        />
      )}
      {type === 'image' && <Image resizeMode={'cover'} source={{uri}} style={[containerStyles.photo, style]} />}
    </>
  );
};
