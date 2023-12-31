import React from 'react';
import {HStack, Text, Pressable, VStack} from 'native-base';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

export const OrderItem = ({
  index,
  orderId,
  currency,
  orderStatus,
  PaymentStatus,
  totalPrice,
  onPress,
  createdAt,
}) => {

  const {t} = useTranslation('langChange')

  return (
    <Pressable
      mt={index === 0 ? 3 : 0}
      mb={3}
      mx={3}
      backgroundColor={'white'}
      borderRadius={5}
      p={2}
      shadow={2}
      borderColor={'white'}
      onPress={onPress}>
      <VStack space={1}>
        <HStack>
          <Text bold>{t('orderNo')}: </Text>
          <Text>{orderId}</Text>
        </HStack>
        <HStack>
          <Text bold>{t('status')}: </Text>
          {orderStatus === 'PENDING' ? (
            <Text color={'red.600'}>{orderStatus}</Text>
          ) : (
            <Text color={'green.600'}>{orderStatus}</Text>
          )}
        </HStack>
        <HStack>
          <Text bold>{t('paymentStatus')}: </Text>
          {PaymentStatus === 'SUCCESS' ? (
            <Text color={'green.600'}>{PaymentStatus}</Text>
          ) : (
            <Text color={'red.600'}>{PaymentStatus}</Text>
          )}
        </HStack>
        <HStack>
          <Text bold>{t('totalPrice')}: </Text>
          <Text>
            {currency} {totalPrice}
          </Text>
        </HStack>
        <Text fontSize="xs">
          {dayjs(createdAt).format('YYYY-MM-DD hh:mm A')}
        </Text>
      </VStack>
    </Pressable>
  );
};
