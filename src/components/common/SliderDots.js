import * as React from 'react';
import {Box, HStack} from 'native-base';

export const SliderDots = ({data, activeIndex}) => {
  return (
    <HStack h={8} w="20%" alignSelf={'center'} key={activeIndex}>
      {data.map((_, index) => {
        if (index === activeIndex.index) {
          return (
            <Box
              bg={'primary.400'}
              h={1}
              w={5}
              mx={1}
              rounded={10}
              key={index}
            />
          );
        }
        return (
          <Box
            bg={'rgba(194,194,194,0.35)'}
            h={1}
            w={5}
            mx={1}
            rounded={10}
            key={index}
          />
        );
      })}
    </HStack>
  );
};
