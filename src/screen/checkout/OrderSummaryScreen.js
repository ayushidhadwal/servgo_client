import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  Button,
  Checkbox,
  CheckIcon,
  HStack,
  Radio,
  ScrollView,
  Select,
  Text,
} from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Rows, Table } from 'react-native-table-component';
import i18n from 'i18next';
import { RFValue } from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import * as cartAction from '../../store/actions/cart';
import { Loader } from '../../components/common/Loader';
import { useError } from '../../hooks/useError';
import { useGetAddressList } from '../../hooks/address/useAddress';
import { successMessage } from '../../utils/message';

const OrderSummaryScreen = ({ navigation }) => {
  const { OrderSummary } = useSelector(state => state.cart);
  console.log(OrderSummary.service);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [wallet, setWallet] = useState([]);
  const [refundWallet, setRefundWallet] = useState([]);
  const [deliveryType, setDeliveryType] = useState('deliver');

  const dispatch = useDispatch();
  const setError = useError();
  const [addresses] = useGetAddressList();

  useEffect(() => {
    let p = 0;
    if (OrderSummary.product && OrderSummary.product.length > 0) {
      OrderSummary.product.forEach(c => {
        p += Number(c.total_price);
      });
    }

    setTotalPrice(p.toFixed(2));
  }, [OrderSummary.product]);

  const tableHead = [
    i18n.t('langChange:serviceTable'),
    `${i18n.t('langChange:priceTable')}`,
    i18n.t('langChange:qtyTable'),
    `${i18n.t('langChange:totalTable')}`,
  ];

  const tableData = OrderSummary.service.map(m => [
    `${m.service_name} - ${m.sub_service_name}\n(${m.child_category_name})`,
    `${OrderSummary.currency}` + ' ' + m.amount,
    m.qty,
    `${OrderSummary.currency}` + ' ' + m.total_price,
  ]);

  const ProductTableHead = ['Product Name', 'Price', 'Qty', 'Sub Total'];

  const ProductTableData = OrderSummary.product.map(m => [
    m.product_name,
    `${OrderSummary.currency}` + ' ' + m.total_price,
    m.qty,
    `${OrderSummary.currency}` + ' ' + m.total_price,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setError(null);
      setLoading(true);
      try {
        await dispatch(cartAction.getOrderSummary());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const onClickHandler = async () => {
    if (!address && OrderSummary.product.length > 0) {
      setError('Please Select Address.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(
        cartAction.checkout(address, wallet, refundWallet, deliveryType),
      );
      if (OrderSummary.product.length > 0) {
        navigation.navigate('Checkout', {
          walletCheck: wallet.length > 0 ? '1' : '0',
          refundWalletCheck: refundWallet.length > 0 ? '1' : '0',
        });
      } else {
        successMessage('Service', 'Service request sent successfully.');
        navigation.navigate('ServiceReq');
      }
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollView p={5}>
        {OrderSummary.product.length > 0 ? (
          <>
            <Text bold ml={2}>
              Shipping Address
            </Text>
            {addresses.length === 0 ? (
              <Box alignItems={'center'}>
                <Text>Please Add Address first</Text>
                <Text
                  bold
                  textDecorationLine={'underline'}
                  color={'primary.400'}
                  onPress={() => navigation.navigate('AddressBook')}>
                  Add Address
                </Text>
              </Box>
            ) : (
              <Select
                size="lg"
                alignSelf={'center'}
                placeholder={'Please Select Address '}
                selectedValue={address}
                width="full"
                borderRadius={'full'}
                onValueChange={async itemValue => {
                  setAddress(itemValue);
                }}
                _selectedItem={{
                  bg: 'primary.400',
                  endIcon: <CheckIcon size={3} />,
                }}
                mt={1}>
                {addresses?.map(m => (
                  <Select.Item
                    key={m.countryName}
                    label={`${m.name}, ${m.address}, ${m.cityName}, ${m.countryName}`}
                    value={m.id}
                  />
                ))}
              </Select>
            )}
          </>
        ) : null}
        {OrderSummary.service.length > 0 && (
          <Box>
            <Text fontStyle={'italic'} color={'red.500'} mt={4} ml={2}>
              Note : Service amount to be paid when booking is accepted.
            </Text>
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.text}
                flexArr={[4, 2, 1, 2]}
              />
              <Rows
                data={tableData}
                textStyle={styles.text}
                flexArr={[4, 2, 1, 2]}
              />
            </Table>
            {OrderSummary.product.length === 0 ? (
              <Button
                mt={4}
                mb={10}
                onPress={onClickHandler}
                isLoading={isLoading}
                isDisabled={isLoading}>
                Send Request
              </Button>
            ) : null}
          </Box>
        )}
        {OrderSummary.product.length > 0 && (
          <>
            <Box my={4}>
              <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row
                  data={ProductTableHead}
                  style={styles.head}
                  textStyle={styles.text}
                  flexArr={[4, 2, 1, 2]}
                />
                <Rows
                  data={ProductTableData}
                  textStyle={styles.text}
                  flexArr={[4, 2, 1, 2]}
                />
              </Table>
              <HStack justifyContent={'space-between'}>
                <Text>Total:</Text>
                <Text bold>
                  {OrderSummary.currency} {totalPrice}
                </Text>
              </HStack>
            </Box>
            <Text bold>
              Wallet Amount : {OrderSummary.currency} {OrderSummary.wallet}
            </Text>
            <Text fontStyle={'italic'} fontSize={'xs'}>
              (you can pay 10.00% of total order via wallet)
            </Text>
            <Checkbox.Group
              onChange={setWallet}
              value={wallet}
              accessibilityLabel="choose">
              <Checkbox value="wallet" my={2} size="sm">
                Wallet
              </Checkbox>
            </Checkbox.Group>
            <Text bold>
              Refund Wallet : ({OrderSummary.currency}{' '}
              {OrderSummary.walletRefund})
            </Text>
            <Checkbox.Group
              onChange={setRefundWallet}
              value={refundWallet}
              accessibilityLabel="choose numbers">
              <Checkbox value="refundWallet" my={2} size="sm">
                Wallet
              </Checkbox>
            </Checkbox.Group>
            <Text bold> Delivery Type</Text>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={deliveryType}
              onChange={nextValue => {
                setDeliveryType(nextValue);
              }}>
              <Radio value="deliver" my={1} size="sm">
                Delivered
              </Radio>
              <Radio value="pickup" my={1} size="sm">
                Pickup
              </Radio>
            </Radio.Group>
            <Button
              mt={4}
              mb={10}
              onPress={onClickHandler}
              isLoading={isLoading}
              isDisabled={isLoading}>
              Proceed to Pay
            </Button>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6, fontSize: RFValue(11) },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 28 },
});

export default OrderSummaryScreen;
