import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import {colors, hexToRGBA} from 'Util/constants/colors';
import {screenWidth} from 'Util/dimensions';

const sliderWidth = screenWidth;
const itemWidth = 52;

interface IconsCarouselProps {
  items: string[];
  onItemPress: (index: number) => void;
}

export const IconsCarousel = (props: IconsCarouselProps) => {
  const paginationRef = useRef(null);
  const {items, onItemPress} = props;
  const [activeIndex, setActiveIndex] = useState(0);

  const onItemPressLocal = useCallback(
    index => {
      setActiveIndex(index);
      onItemPress(index);
    },
    [onItemPress],
  );
  const renderItem = useCallback(
    ({item, index}) => {
      const isActive = index === activeIndex;
      return (
        <TouchableOpacity onPress={() => onItemPressLocal(index)} key={index}>
          <Image source={{uri: item.uri}} style={[styles.smallPhoto, isActive && {borderWidth: 2}]} />
        </TouchableOpacity>
      );
    },
    [activeIndex, onItemPressLocal],
  );
  const getItemLayout = useCallback((data, index) => ({length: itemWidth, offset: itemWidth * index, index}), []);
  const keyExtractor = useCallback((item, index) => index.toString(), []);
  return (
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
      initialScrollIndex={0}
      keyExtractor={keyExtractor}
      bounces={false}
      layout={'stack'}
    />
  );
};

const styles = StyleSheet.create({
  smallPhoto: {
    height: 52,
    width: 52,
    borderRadius: 8,
    borderColor: 'white',
  },
});
