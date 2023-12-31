import React from 'react';
import {Box, HStack, Text, Image, Pressable} from 'native-base';
import {ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const CartItem = ({
  index,
  image,
  id,
  name,
  price,
  quantity,
  currency,
  onPressHandler,
  value,
  isLoading,
}) => {
  return (
    <Box
      mt={index === 0 ? 3 : 0}
      mb={3}
      width={'97%'}
      shadow={2}
      borderRadius={3}
      alignSelf={'center'}
      backgroundColor={'white'}
      py={2}>
      <HStack>
        <Image
          source={{uri: image}}
          alt={'No img'}
          w={'25%'}
          mx={1.5}
          resizeMode={'cover'}
        />
        <Box w={'60%'}>
          <Text numberOfLines={2} w={'100%'} fontSize={'sm'} fontWeight={'500'}>
            {name}
          </Text>
          <Text bold fontSize={'xs'} color={'green.700'}>
            {currency} {price}
          </Text>
          <Text fontSize={'xs'}>Qty : {quantity}</Text>
        </Box>
        {isLoading && value === id ? (
          <ActivityIndicator
            color={'red'}
            size={'small'}
            style={{marginLeft: 5, alignSelf: 'flex-end'}}
          />
        ) : (
          <Pressable
            onPress={() => onPressHandler(id, 'product')}
            alignSelf={'flex-end'}
            ml={2}>
            <MaterialIcons name="delete" size={24} color="red" />
          </Pressable>
        )}
      </HStack>
    </Box>
  );
};
