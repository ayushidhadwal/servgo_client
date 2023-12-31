import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Button, Divider, Title, Checkbox} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {Row, Rows, Table} from 'react-native-table-component';
import * as requestAction from '../store/actions/request';
import Colors from '../constants/Colors';
import {useTranslation} from 'react-i18next';

const OrderPageScreen = ({navigation, route}) => {
  const {bookingId} = route.params;
  const {t} = useTranslation('langChange');
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletChecked, setWalletChecked] = useState(false);
  const [refundWalletChecked, setRefundWalletChecked] = useState(false);

  const dispatch = useDispatch();
  const {payOrderDetails: orderDetails} = useSelector(state => state.request);

  const tableHead = [
    t('langChange:serviceTable'),
    t('langChange:qty'),
    t('langChange:totalTable'),
  ];

  const tableData = orderDetails.serviceDetails.map(m => [
    ` ${m.service_name} - ${m.subcategory_name}\n(${m.service_desc})`,
    m.st_qty,
    `${orderDetails.currency}  ` + m.st_service_price * m.st_qty,
  ]);
  

  // const tableHead = [ t('langChange:serviceTable'),  t('langChange:priceTable'),  t('langChange:qtyTable'),  t('langChange:totalTable')];
  // const tableData = orderDetails.serviceDetails.map((m) => [
  //   m.child_cat === null
  //       ? `${m.service_name}-${m.subcategory_name}`
  //       : `${m.service_name}-${m.subcategory_name} - ${m.child_cat} \n (${m.service_desc})`,
  //   "AED  " + m.st_service_price,
  //   m.st_qty,
  //   "AED  " + m.st_service_price * m.st_qty,
  // ]);

  // useEffect(() => {
  //   if (paymentAmountDetails.bookingId === bookingId) {
  //     if (paymentAmountDetails.card_pay > 0) {
  //       navigation.navigate("OnlinePayment", {
  //         pay_amount: paymentAmountDetails.card_pay,
  //         wallet_check: walletChecked,
  //         pay_from_wallet: paymentAmountDetails.points_pay,
  //         refund_wallet_check: refundWalletChecked,
  //         pay_from_refund_wallet: paymentAmountDetails.wallet_pay,
  //         total_amount: orderDetails.total,
  //         bookingId: bookingId,
  //       });
  //     } else {
  //       navigation.goBack();
  //     }
  //   }
  // }, [paymentAmountDeta.ils]);

  // 
  //
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.setPayOrderDetails(bookingId));
        // dispatch({
        //   type: GET_PAYMENT_AMOUNT,
        //   bookingId: "",
        //   gatewayData: {
        //     point_wallet: 0,
        //     refund_wallet: 0,
        //     total_price: 0,
        //     points_pay: 0,
        //     wallet_pay: 0,
        //     card_pay: 0,
        //   },
        // });
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation, bookingId]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _proceedToPayHandler = async () => {
    setPayLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.getPaymentAmount(
          bookingId,
          orderDetails.total,
          refundWalletChecked,
          walletChecked,
        ),
      );
      navigation.navigate('PayForService', {
        orderDetails: orderDetails.serviceDetails,
        bookingId: bookingId,
        refundWalletChecked: refundWalletChecked,
        walletChecked: walletChecked,
      });
      setPayLoading(false);
    } catch (e) {
      setError(e.message);
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <ScrollView style={styles.screen}>
      <Title style={styles.heading}>{t('langChange:bookDetails')}</Title>
      <View style={styles.content}>
        <View style={styles.rowStyle}>
          <Text style={styles.title}>{t('langChange:bookId')} :</Text>
          <Text style={styles.textStyle}>
            {orderDetails.booking.booking_id}
          </Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.title}>{t('langChange:bookDate')} : </Text>
          <Text style={styles.textStyle}>
            {orderDetails.booking.booking_date}
          </Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.title}>{t('langChange:bookTime')} : </Text>
          <Text style={styles.textStyle}>
            {orderDetails.booking.booking_time}
          </Text>
        </View>
        <Text style={[styles.title, {marginTop: RFValue(10)}]}>
          {t('serviceDetails')}:{' '}
        </Text>
        {/*<View*/}
        {/*  style={{*/}
        {/*    borderWidth: RFValue(1),*/}
        {/*    borderColor: "#cfd1d0",*/}
        {/*    marginTop: RFValue(10),*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <DataTable>*/}
        {/*    <DataTable.Header>*/}
        {/*      <DataTable.Title>Service</DataTable.Title>*/}
        {/*      <DataTable.Title numeric>Quantity</DataTable.Title>*/}
        {/*      /!*<DataTable.Title numeric>Price</DataTable.Title>*!/*/}
        {/*    </DataTable.Header>*/}
        {/*    {orderDetails.serviceDetails.map((i, index) => (*/}
        {/*      <DataTable.Row key={index}>*/}
        {/*        <DataTable.Cell>{i.subcategory_name}</DataTable.Cell>*/}
        {/*        <DataTable.Cell numeric>{i.st_qty}</DataTable.Cell>*/}
        {/*        /!*<DataTable.Cell numeric>*!/*/}
        {/*        /!*  AED {i.st_qty * i.st_service_price}*!/*/}
        {/*        /!*</DataTable.Cell>*!/*/}
        {/*      </DataTable.Row>*/}
        {/*    ))}*/}
        {/*  </DataTable>*/}
        <Table
          borderStyle={{
            borderWidth: 2,
            borderColor: '#cfd1d0',
          }}
          style={{marginTop: RFValue(10)}}>
          <Row
            data={tableHead}
            style={styles.head}
            flexArr={[2, 1, 1, 1]}
            textStyle={{margin: 6, fontSize: RFValue(10), fontWeight: 'bold'}}
          />
          <Rows

            data={tableData}
            flexArr={[2, 1, 1, 1]}
            textStyle={{margin: 6, fontSize: RFValue(10)}}
          />
        </Table>
        <View style={[styles.rowStyle, {marginTop: RFValue(15)}]}>
          <Text style={styles.title}>{t('finalPrice')} : </Text>
          <Text style={styles.textStyle}>
            {orderDetails.currency} {orderDetails.booking.final_service_price}
          </Text>
        </View>
      </View>
      <Divider style={{backgroundColor: 'black', marginTop: RFValue(20)}} />
      <View>
        <View style={styles.content1}>
          <Title style={styles.heading}>{t('bilDetails')}</Title>
        </View>
        <View style={styles.rowStyle2}>
          <Text style={styles.title5}>
            {t('wallet') +
              '( ' +
              orderDetails.currency +
              ' ' +
              orderDetails.wallet +
              ' )\n'}
            <Text style={styles.note}>
              {'( ' +
                t('walletYou') +
                ' ' +
                orderDetails.walletPercent +
                '%' +
                t('walletTotal') +
                ' )'}
            </Text>
          </Text>
          <Checkbox.Android
            status={walletChecked ? 'checked' : 'unchecked'}
            onPress={() => setWalletChecked(!walletChecked)}
            color={Colors.primary}
            disabled={orderDetails.wallet === '0.00'}
          />
        </View>

        <View style={styles.rowStyle2}>
          <Text style={styles.title5}>
            {t('refundWallet') +
              '( ' +
              orderDetails.currency +
              ' ' +
              orderDetails.refund_wallet +
              ' )\n'}
          </Text>
          <Checkbox.Android
            status={refundWalletChecked ? 'checked' : 'unchecked'}
            onPress={() => setRefundWalletChecked(!refundWalletChecked)}
            color={Colors.primary}
            disabled={orderDetails.refund_wallet === '0.00'}
          />
        </View>
      </View>
      <Divider style={{marginVertical: RFValue(5)}} />
      <View style={styles.rowStyle2}>
        <Text style={[styles.title1, {fontWeight: 'bold'}]}>
          {t('totalAmt')}
        </Text>
        <Text style={[styles.title1, {fontWeight: 'bold'}]}>
          {orderDetails.currency} {orderDetails.total}
        </Text>
      </View>
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{height: RFValue(40)}}
        uppercase={false}
        onPress={_proceedToPayHandler}
        disabled={payLoading}
        loading={payLoading}>
        {t('proceedToPay')}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    textAlign: 'center',
    padding: RFValue(10),
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(2),
  },
  rowStyle1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(2),
    paddingHorizontal: RFValue(20),
  },
  rowStyle2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(5),
    paddingHorizontal: RFValue(15),
  },
  title: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
  },
  title1: {
    fontSize: RFValue(12),
  },
  title5: {
    fontSize: RFValue(12),
    paddingTop: RFValue(8),
  },
  content: {
    backgroundColor: '#d0e9f2',
    padding: RFValue(20),
  },
  content1: {
    // padding: RFValue(20),
  },
  btn: {
    width: '70%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
  note: {
    fontSize: RFValue(10),
    color: Colors.grey,
    fontStyle: 'italic',
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //
  head: {height: 40},
  text: {margin: 6, fontSize: RFValue(11)},
  // title: { flex: 1, backgroundColor: "#f6f8fa" },
  row: {height: 28},
});

export default OrderPageScreen;
