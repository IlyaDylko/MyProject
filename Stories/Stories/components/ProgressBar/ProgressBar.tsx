import React, {useCallback} from 'react';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';

import {ProgressItem} from './ProgressItem';

import {rem, screenWidth} from 'Util/dimensions';

interface ProgressViewProps {
  firstAnimationStartedCallback: () => void;
  shouldGoToTheBeginning: boolean;
  stopAnimation: boolean;
  duration?: number;
  style?: StyleProp<ViewStyle>;
  activeIndex: number;
  mediaReady: boolean;
  videoLength: number;
  data: {type: string; uri: string}[];
  onAnimationEnd: () => void;
}

export const ProgressBar = (props: ProgressViewProps) => {
  const {
    firstAnimationStartedCallback,
    shouldGoToTheBeginning,
    duration = 3000,
    style,
    activeIndex,
    onAnimationEnd,
    mediaReady,
    videoLength,
    data,
    stopAnimation,
  } = props;

  const keyExtractor = useCallback((item, index) => index.toString(), []);
  const itemSeparator = useCallback(() => <View style={{marginLeft: rem(2)}} />, []);

  return (
    <View style={[styles.parent, style]}>
      <FlatList
        contentContainerStyle={styles.flatStyle}
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        legacyImplementation={false}
        data={props.data}
        ItemSeparatorComponent={itemSeparator}
        keyExtractor={keyExtractor}
        renderItem={({item, index}) => {
          return (
            <ProgressItem
              mediaReady={mediaReady}
              duration={duration}
              videoLength={videoLength}
              storyData={item}
              onAnimationEnd={onAnimationEnd}
              index={index}
              firstAnimationStartedCallback={firstAnimationStartedCallback}
              activeIndex={activeIndex}
              width={(screenWidth - rem(50)) / data.length}
              stopAnimation={stopAnimation}
              shouldGoToTheBeginning={shouldGoToTheBeginning}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
    flex: 1,
    zIndex: 100,
  },
  flatStyle: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
