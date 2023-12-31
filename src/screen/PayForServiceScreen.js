import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Alert, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RFValue} from 'react-native-responsive-fontsize';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {Row, Rows, Table} from 'react-native-table-component';

import {TextRow} from '../components/TextRow';
// import * as requestAction from '../store/actions/request';
import {useTranslation} from 'react-i18next';
import {StripePaymentGatewayForService} from './service-provider/StripePaymentGatewayForService';

const PayForServiceScreen = props => {
  const {bookingId, refundWalletChecked, walletChecked} = props.route.params;
  const {t} = useTranslation('langChange');
  // const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const dispatch = useDispatch();

  const {Profile} = useSelector(state => state.user);
  const {paymentAmountDetails} = useSelector(state => state.request);

  // const navigation = props.navigation;

  // const _onClickHandler = async () => {
  //   setError(null);
  //   setLoading(true);
  //   if (paymentAmountDetails.card_pay > 0) {
  //     navigation.navigate('OnlinePayment', {
  //       pay_amount: paymentAmountDetails.card_pay,
  //       wallet_check: walletChecked ? 1 : 0,
  //       pay_from_wallet: paymentAmountDetails.points_pay,
  //       refund_wallet_check: refundWalletChecked ? 1 : 0,
  //       pay_from_refund_wallet: paymentAmountDetails.wallet_pay,
  //       total_amount: paymentAmountDetails.total_amount,
  //       vat_amount: paymentAmountDetails.vat,
  //       bookingId: bookingId,
  //       payment_method: 'online',
  //     });
  //   } else {
  //     try {
  //       await dispatch(
  //         requestAction.pay_for_order(
  //           paymentAmountDetails.card_pay,
  //           walletChecked ? 1 : 0,
  //           paymentAmountDetails.points_pay,
  //           refundWalletChecked ? 1 : 0,
  //           paymentAmountDetails.wallet_pay,
  //           bookingId,
  //           paymentAmountDetails.total_amount,
  //           paymentAmountDetails.vat,
  //           '0000 0000 0000 0000',
  //           '00',
  //           '0000',
  //           '000',
  //           'offline',
  //         ),
  //       );
  //       alert('Payment Successfully Done!');
  //       props.navigation.pop(2);
  //     } catch (e) {
  //       setLoading(false);
  //       setError(e.msg);
  //     }
  //   }
  //   setLoading(false);
  // };

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const tableHead = [
    t('serviceTable'),
    t('priceTable'),
    t('qtyTable'),
    t('totalTable'),
  ];
  const tableData = paymentAmountDetails.serviceDetails.map(m => [
    `${m.service_name} - ${m.subcategory_name}\n(${m.service_desc})`,
    paymentAmountDetails.currency + ' ' + m.st_service_price,
    m.st_qty,
    paymentAmountDetails.currency + ' ' + m.st_service_price * m.st_qty,
  ]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.table}>
          {/*<DataTable>*/}
          {/*  <DataTable.Header>*/}
          {/*    <DataTable.Title>Service</DataTable.Title>*/}
          {/*    <DataTable.Title numeric>Price</DataTable.Title>*/}
          {/*    <DataTable.Title numeric>Quantity</DataTable.Title>*/}
          {/*    <DataTable.Title numeric>Total Price</DataTable.Title>*/}
          {/*  </DataTable.Header>*/}
          {/*  {paymentAmountDetails.serviceDetails.map((i, index) => (*/}
          {/*    <DataTable.Row key={index}>*/}
          {/*      <DataTable.Cell>*/}
          {/*        <Text>{i.subcategory_name}</Text>*/}
          {/*      </DataTable.Cell>*/}
          {/*      <DataTable.Cell numeric>{i.st_service_price}</DataTable.Cell>*/}
          {/*      <DataTable.Cell numeric>{i.st_qty}</DataTable.Cell>*/}
          {/*      <DataTable.Cell numeric>*/}
          {/*        {i.st_qty * i.st_service_price}*/}
          {/*      </DataTable.Cell>*/}
          {/*    </DataTable.Row>*/}
          {/*  ))}*/}
          {/*</DataTable>*/}
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: '#cfd1d0',
            }}>
            <Row
              data={tableHead}
              style={styles.head}
              textStyle={{margin: 6, fontSize: RFValue(11)}}
              flexArr={[3, 1, 1, 1]}
            />
            <Rows
              data={tableData}
              textStyle={{margin: 6, fontSize: RFValue(13)}}
              flexArr={[3, 1, 1, 1]}
            />
          </Table>
          <View style={{marginVertical: RFValue(5)}}>
            <TextRow
              desc={
                paymentAmountDetails.currency +
                ' ' +
                paymentAmountDetails.total_price
              }
              heading={t('serviceTotal')}
              style={{fontWeight: 'bold'}}
            />
          </View>
          <Divider />
          <View>
            {paymentAmountDetails.points_pay > 0 && (
              <TextRow
                desc={-paymentAmountDetails.points_pay}
                heading={t('walletPay')}
              />
            )}
            <TextRow
              desc={
                paymentAmountDetails.payable_amount - paymentAmountDetails.vat
              }
              heading={t('total')}
            />
            <TextRow
              desc={'+ ' + paymentAmountDetails.vat}
              heading={
                t('vat') + ' (' + paymentAmountDetails.vat_percent + '%)'
              }
            />
            {paymentAmountDetails.wallet_pay > 0 && (
              <TextRow
                desc={-paymentAmountDetails.refund_wallet}
                heading={t('refundWalletPay')}
              />
            )}
          </View>
          <Divider />
          <View style={styles.total}>
            <TextRow
              desc={
                paymentAmountDetails.currency +
                ' ' +
                paymentAmountDetails.card_pay
              }
              heading={t('grandTotal')}
              style={{fontWeight: 'bold'}}
            />
          </View>
          <Divider />
        </View>
        <StripePaymentGatewayForService
          bookingId={bookingId}
          paymentIntent={paymentAmountDetails?.paymentResponse?.paymentIntent}
          country={paymentAmountDetails?.paymentResponse?.countryShortName}
          customer={paymentAmountDetails?.paymentResponse?.customer}
          ephemeralKey={paymentAmountDetails?.paymentResponse?.ephemeralKey}
          username={Profile.name}
          walletCheck={walletChecked ? 1 : 0}
          refundWalletCheck={refundWalletChecked ? 1 : 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: RFValue(10),
  },
  table: {
    borderWidth: RFValue(1),
    borderColor: '#cfd1d0',
    marginTop: RFValue(10),
  },
  total: {
    marginVertical: RFValue(5),
    marginTop: RFValue(5),
  },
  btn: {
    marginVertical: RFValue(20),
    width: '45%',
    alignSelf: 'center',
    borderRadius: 20,
  },
});

export default PayForServiceScreen;
