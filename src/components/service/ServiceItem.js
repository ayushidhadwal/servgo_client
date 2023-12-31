import React from 'react';
import {Box, HStack, Pressable, Text} from 'native-base';
import {ActivityIndicator} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';

export const ServiceItem = ({
  currency,
  amount,
  serviceName,
  subServiceName,
  childCategoryName,
  bookingDate,
  bookingTime,
  quantity,
  id,
  index,
  onPressHandler,
  value,
  isLoading,
}) => {
  return (
    <Box
      mb={3}
      mt={index === 0 ? 3 : 0}
      width={'97%'}
      shadow={2}
      borderRadius={3}
      alignSelf={'center'}
      backgroundColor={'white'}
      p={2}>
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <Box w={'50%'}>
          <Text bold>{serviceName}</Text>
          <Text bold>{subServiceName}</Text>
          <Text bold>{childCategoryName}</Text>
        </Box>
        <Text>x{quantity}</Text>
        <Text color={'green.700'}>
          {currency} {quantity * amount}
        </Text>
      </HStack>
      <HStack alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Text italic fontSize={'xs'}>
            Booking Date : {dayjs(bookingDate).format('DD MMM YYYY')}
          </Text>
          <Text italic fontSize={'xs'}>
            Booking Time : {bookingTime}
          </Text>
        </Box>
        {isLoading && value === id ? (
          <ActivityIndicator color={'red'} size={'small'} />
        ) : (
          <Pressable
            onPress={() => onPressHandler(id, 'service')}
            alignSelf={'center'}>
            <MaterialIcons name="delete" size={24} color="red" />
          </Pressable>
        )}
      </HStack>
    </Box>
  );
};
