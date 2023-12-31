import React from 'react';
import {Box, Text, View} from 'native-base';
import {FlatList} from 'react-native';

import {OrderItem} from '../../components/order/OrderItem';
import {useGetOrderList} from '../../hooks/order/useGetOrderList';
import {Loader} from '../../components/common/Loader';

const OrderScreen = ({navigation}) => {
  const [OrderList, loading] = useGetOrderList();

  const renderItem = ({item, index}) => {
    return (
      <OrderItem
        index={index}
        orderStatus={item.status}
        currency={item.currency}
        PaymentStatus={item.payment_status}
        totalPrice={item.total_price}
        orderId={item.order_id}
        createdAt={item.created_at}
        onPress={() => navigation.navigate('OrderDetail', {id: item.id})}
      />
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Box backgroundColor={'white'} flex={1}>
      {OrderList.length === 0 ? (
        <View flex={1} justifyContent={'center'} alignItems="center">
          <Text fontSize={'2xl'}>No Orders</Text>
        </View>
      ) : (
        <FlatList
          data={OrderList}
          renderItem={renderItem}
          keyExtractor={item => item.order_id.toString()}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Box>
  );
};

export default OrderScreen;
