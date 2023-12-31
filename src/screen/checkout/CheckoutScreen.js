import React from 'react';
import {StyleSheet} from 'react-native';
import {Box, Divider, HStack, ScrollView, Text} from 'native-base';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {Row, Rows, Table} from 'react-native-table-component';
import {RFValue} from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import {StripePaymentGateway} from '../service-provider/StripePaymentGateway';

const CheckoutScreen = ({route}) => {
  const {walletCheck, refundWalletCheck} = route.params;

  const {checkoutData} = useSelector(state => state.cart);
  const {Profile} = useSelector(state => state.user);

  const ProductTableHead = ['Product Name', 'Price', 'Qty', 'Sub Total'];

  const ProductTableData = checkoutData.product.map(m => [
    m.product_name,
    `${checkoutData.currency}` + ' ' + m.total_price,
    m.qty,
    `${checkoutData.currency}` + ' ' + m.total_price,
  ]);

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{flex: 1, backgroundColor: Colors.white}}>
      <ScrollView p={5}>
        <Text bold>Shipping Address</Text>
        <Text my={2}>
          {checkoutData.address.buildingName +
            ' ' +
            checkoutData.address.userAddress +
            ' ' +
            checkoutData.address.cityName +
            ' ' +
            checkoutData.address.countryName}
        </Text>
        <Divider />
        <Box my={4}>
          <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
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
          <HStack justifyContent={'space-between'} mt={2}>
            <Text>Total:</Text>
            <Text bold>
              {checkoutData.currency} {checkoutData.totalPrice.toFixed(2)}
            </Text>
          </HStack>
          <HStack justifyContent={'space-between'}>
            <Text>Vat({checkoutData.vatPercent}%):</Text>
            <Text>
              + {checkoutData.currency} {checkoutData.vat}
            </Text>
          </HStack>
          <HStack justifyContent={'space-between'}>
            <Text>Delivery Charges:</Text>
            <Text>
              + {checkoutData.currency} {checkoutData.deliveryCharges}
            </Text>
          </HStack>
          <HStack justifyContent={'space-between'}>
            <Text>Grand Total:</Text>
            <Text bold>
              {checkoutData.currency}{' '}
              {Number(checkoutData.totalAmount).toFixed(2)}
            </Text>
          </HStack>
        </Box>

        <StripePaymentGateway
          paymentIntent={checkoutData?.paymentResponse?.paymentIntent}
          country={checkoutData?.paymentResponse?.countryShortName}
          customer={checkoutData?.paymentResponse?.customer}
          ephemeralKey={checkoutData?.paymentResponse?.ephemeralKey}
          username={Profile.name}
          walletCheck={walletCheck}
          refundWalletCheck={refundWalletCheck}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontSize: RFValue(11)},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
});

export default CheckoutScreen;
