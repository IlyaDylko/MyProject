import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import {colors, hexToRGBA} from 'Util/constants/colors';

const sliderWidth = 160;

export const CarouselPagination = props => {
  const paginationRef = useRef(null);
  const {activeIndex, items} = props;
  const itemWidth = 15;

  useEffect(() => {
    paginationRef?.current?.snapToItem(activeIndex);
  }, [activeIndex]);

  const renderItem = useCallback(
    ({item, index}) => {
      const isActive = index === activeIndex;
      const visible = Math.abs(index - activeIndex) <= 4;
      const small = Math.abs(index - activeIndex) === 3;
      const verySmall = Math.abs(index - activeIndex) === 4;

      return (
        <>
          {visible && (
            <View
              key={index}
              style={[
                styles.item,
                isActive ? {backgroundColor: 'white'} : {},
                small ? styles.small : {},
                verySmall ? styles.verySmall : {},
              ]}
            />
          )}
        </>
      );
    },
    [activeIndex],
  );
  const getItemLayout = useCallback(
    (data, index) => ({length: itemWidth, offset: itemWidth * index, index}),
    [itemWidth],
  );
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  return (
    <View style={styles.container}>
      <Carousel
        ref={paginationRef}
        data={items}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        firstItem={0}
        getItemLayout={getItemLayout}
        enableSnap={true}
        enableMomentum={true}
        horizontal={true}
        inactiveSlideOpacity={1}
        inactiveSlideScale={1}
        initialScrollIndex={0}
        keyExtractor={keyExtractor}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    flexDirection: 'row',

    width: sliderWidth,
    height: 25,

    left: 20,
    top: 20,
  },
  item: {
    height: 10,
    alignSelf: 'center',
    width: 10,
    borderRadius: 15,
    backgroundColor: hexToRGBA(colors.white, 0.5),
  },
  small: {
    height: 9,
    width: 9,
  },
  verySmall: {
    height: 7,
    width: 7,
  },
});
