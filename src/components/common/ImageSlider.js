import React, {useCallback, useState, useRef} from 'react';
import {Box} from 'native-base';
import {Dimensions, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image} from '../Image';

import {SliderDots} from './SliderDots';

const window = Dimensions.get('screen');

export const ImageSlider = ({data}) => {
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useCallback((data: {changed: []}) => {
    setIndex(data.changed[0]);
  }, []);

  const flatListRef = useRef(null);

  const renderItem = ({item}) => {
    return (
      <Box h={window.height / 3} w={window.width}>
        <Image
          source={{uri: item}}
          resizeMode="stretch"
          style={{width: '100%', height: '100%'}}
        />
      </Box>
    );
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item}
        horizontal={true}
        pagingEnabled={true}
        style={{marginBottom: 10}}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: '50%',
        }}
        ref={flatListRef}
      />
      <SliderDots data={data} activeIndex={index} />
    </SafeAreaView>
  );
};
