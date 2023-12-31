import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, ScrollView, Text} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGetCartList} from '../../hooks/cart/useGetCartList';
import {Loader} from '../../components/common/Loader';
import {CartItem} from '../../components/cart/CartItem';
import {URL} from '../../constants/base_url';
import {ServiceItem} from '../../components/service/ServiceItem';
import {useDispatch} from 'react-redux';
import {useError} from '../../hooks/useError';
import * as cartAction from '../../store/actions/cart';
import { RFValue } from 'react-native-responsive-fontsize';

const CartScreen = ({navigation}) => {
  const [ProductCartList, ServiceCartList, loading] = useGetCartList();

  const [serviceTotalPrice, setServiceTotalPrice] = useState(0);
  const [productTotalPrice, setProductTotalPrice] = useState(0);

  const [currency, setCurrency] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    let p = 0;
    let c = 0;

    if (ProductCartList && ProductCartList.length > 0) {
      ProductCartList.forEach(i => {
        p += Number(i.total_price);
        setCurrency(i.currency);
      });
    }

    if (ServiceCartList && ServiceCartList.length > 0) {
      ServiceCartList.forEach(a => {
        c += Number(a.amount) * Number(a.qty);
        setCurrency(a.currency);
      });
    }

    setProductTotalPrice(p);
    setServiceTotalPrice(c);
  }, [ProductCartList, ServiceCartList]);

  const dispatch = useDispatch();
  const setError = useError();

  const onPressHandler = useCallback(
    async (cartId, itemType) => {
      setValue(cartId);
      setError(null);
      setIsLoading(true);
      try {
        await dispatch(cartAction.deleteCart(cartId, itemType));
      } catch (e) {
        setError(e.message);
      }
      setIsLoading(false);
    },
    [dispatch, setError],
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', padding: 10}}
      edges={['bottom']}>
      {ProductCartList.length === 0 && ServiceCartList.length === 0 ? (
        <Box alignItems={'center'} justifyItems={'center'}>
          <Text>NO DATA</Text>
        </Box>
      ) : (
        <ScrollView>
          {ProductCartList.length > 0 && (
            <>
              <Text bold color={'primary.400'} fontSize={'md'}>
                Products
              </Text>
              {ProductCartList?.map((item, index) => (
                <CartItem
                  id={item.id}
                  index={index}
                  image={URL + item.product_image1}
                  name={item.product_name}
                  price={item.total_price}
                  quantity={item.qty}
                  onPressHandler={onPressHandler}
                  value={value}
                  isLoading={isLoading}
                  currency={currency}
                />
              ))}
            </>
          )}
          {ServiceCartList.length > 0 && (
            <>
              <Text bold color={'primary.400'} fontSize={'md'}>
                Services
              </Text>
              {ServiceCartList?.map((item, index) => (
                <ServiceItem
                  id={item.id}
                  amount={item.amount}
                  index={index}
                  serviceName={item.service_name}
                  subServiceName={item.sub_service_name}
                  childCategoryName={item.child_category_name}
                  bookingDate={item.booking_date}
                  bookingTime={item.booking_time}
                  quantity={item.qty}
                  currency={item.currency}
                  onPressHandler={onPressHandler}
                  value={value}
                  isLoading={isLoading}
                />
              ))}
            </>
          )}
          <Box pt={2}>
            <Text
              textAlign={'right'}
              bold
              fontSize={'md'}
              color={'primary.400'}>
              Total Amount : {currency} {serviceTotalPrice + productTotalPrice}
            </Text>
            <Button
              mode="contained"
              style={{
                width: '80%',
                marginVertical: RFValue(20),
                alignSelf: 'center',
              }}
              onPress={() => navigation.navigate('OrderSummary')}
              >
              Proceed
            </Button>
          </Box>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default CartScreen;
