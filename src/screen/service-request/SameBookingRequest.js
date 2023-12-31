import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Badge, Card, Searchbar } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next';
import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import { Button, HStack, Checkbox, Box, Divider } from 'native-base';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { Checkbox as check } from 'react-native-paper';



const SameBookingRequest = ({ navigation, route }) => {

  const { bookingId } = route.params

  const { t } = useTranslation('langChange');
  const dispatch = useDispatch();
  const { bookingList } = useSelector(state => state.request);
  const { Profile } = useSelector(state => state.user);

  const [sameBookingList, setSameBookingList] = useState([])

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');

  const [payLoading, setPayLoading] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const { userId } = useSelector(state => state.auth)


  useEffect(() => {
    const r = bookingList.filter(
      m => m.booking_id == bookingId
    )

    setSameBookingList(r);
  }, [bookingList])

  useEffect(() => {
    setFilteredList([...bookingList]);
  }, [bookingList]);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(requestAction.get_booking());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation]);


  const [selectedService, setSelectedService] = useState([])
  const [totalAmount, setTotalAmount] = useState(0);

  const [childServices, setChildServices] = useState([]);




  const _onSearchHandler = searchText => {
    setFilteredList(
      bookingList.filter(
        item =>
          item.service_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.booking_date_time
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.service_status
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          item.payment_status.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  useEffect(() => {
    if (selectedService.length > 0) {
      setTotalAmount(selectedService.map((item) => item.amount).reduce(
        (ac, amount) => ac + amount
      ))

      setChildServices(selectedService.map((item) => item.id));



    } else { setTotalAmount(0); setChildServices([]) }
  }, [selectedService])

  const addAmount = (id, amount) => {
    // selectedService.push({id,amount})
    setSelectedService((prevState) => {
      const i = prevState.findIndex(item => item.id === id);
      if (i < 0) {
        return [...prevState, { id, amount }];
      }
      return prevState.filter(
        m => m.id !== id
      )
    })
  }

  const [initLoading, setInitLoading] = useState(false)
  const [initData, setInitData] = useState(null)

  const [walletCheck, setWalletChecked] = useState(false);
  const [refundWalletCheck, setRefundWalletChecked] = useState(false);

  const initMultiplePayment = async (amt, wallet, refundWallet) => {
    // multiple payment api
    setInitLoading(true)
    try {

      const form = new FormData();
      form.append('booking_id', bookingId);
      form.append('total_price', amt);
      form.append('check_refund_wallet', wallet ? 'yes' : '');
      form.append('check_wallet', refundWallet ? 'yes' : '');

      childServices.forEach((id, index) => {
        form.append(`child_id[${index}]`, id);
      });

      const response = await axios.post('user/get-multiple-payment-amount', form);

      console.log(response.data);

      if (response.data.status) {
        setInitData(response.data.data);
      } else {
        setError(response.data.msg);
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setInitLoading(false);
    }
  }

  useEffect(() => {
    if (childServices.length > 0) {
      initMultiplePayment(totalAmount, refundWalletCheck, walletCheck)
    }
  }, [totalAmount, childServices, refundWalletCheck, walletCheck])

  //pay func
  const onPayHandler = async () => {
    setPayLoading(true)
    setError(null);
    try {
      // open payment sheet
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Servgo',
        customerId: initData?.paymentResponse.customer,
        customerEphemeralKeySecret: initData?.paymentResponse.ephemeralKey,
        paymentIntentClientSecret: initData?.paymentResponse.paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: Profile.name,
          address: { country: initData?.paymentResponse.countryShortNam },
        },
      });


      // check error 
      if (error) {
        setError(error.message);
      } else {
        const { error } = await presentPaymentSheet();

        if (error) {
          setError(error.message);
        }
        else {
          try {


            // pay multiple order api
            const formData = new FormData();

            formData.append('pay_amount', initData?.card_pay);
            formData.append('wallet_check', '');
            formData.append('pay_from_wallet', initData?.points_pay);
            formData.append('refund_wallet_check', '');
            formData.append('pay_from_refund_wallet', initData?.wallet_pay);
            formData.append('booking_id', bookingId);
            formData.append('total_amount', initData?.total_amount);
            formData.append('vat_amount', initData?.vat);
            formData.append('user_id', userId);
            formData.append('payment_method', 'online');

            const response = await axios.post('user/payForMultipleOrder', formData);

            Toast.show({
              type: 'success',
              text1: 'Service Payment!',
              text2: 'Service payment is successful!',
            });
            navigation.navigate('ServiceReq');
          } catch (error) {
            setError(error.message)
          }
        }
      }
    }
    catch (error) {
      setError(error.message)
    }
    setPayLoading(false)
  }


  const _renderItem = ({ item, index }) => {
    console.log(item.service_status)
    const checkStatus = item.service_status === 'ACCEPTED' || item.service_status === 'COMPLETED';
    console.log(checkStatus)
    return (
      <HStack flex={1} >
        <Card
          style={[styles.cardContainer, index === 0 && { marginTop: RFValue(10) }]}
          onPress={() => {
            navigation.navigate('RequestDetails', { providerDetails: item })
            setTotalAmount(0)
            setSelectedService([])
          }
          }>
          <View style={styles.group}>
            <View style={styles.rowStyle}>
              <Text style={styles.bold}>{t('bookId')}: </Text>
              <Text style={styles.time1}>{item.booking_id}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.bold}>{t('bookTime')}: </Text>
              <Text style={styles.time}>{item.booking_date_time}</Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.bold}>{t('amt')}: </Text>
              <Text style={styles.time}>
                {item.currency} {item.total_price}
              </Text>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.bold}>{t('serviceStatus')}: </Text>

              <Badge
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.service_status === 'ACCEPTED' ||
                        item.service_status === 'COMPLETED'
                        ? 'green'
                        : item.service_status === 'REFUND'
                          ? 'orange'
                          : item.service_status === 'PENDING'
                            ? 'grey'
                            : item.service_status === 'RESCHEDULE'
                              ? 'skyblue'
                              : 'red',
                  },
                ]}>
                <Text
                  style={[
                    styles.time,
                    {
                      color: 'white',
                      fontSize: RFValue(10),
                    },
                  ]}>
                  {item.service_status}
                </Text>
              </Badge>
            </View>
            <View style={styles.rowStyle}>
              <Text style={styles.bold}>{t('paymentStatus')}: </Text>

              <Badge
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      item.payment_status === 'SUCCESS'
                        ? 'green'
                        : item.payment_status === 'REFUND'
                          ? 'orange'
                          : item.payment_status === 'PENDING'
                            ? 'grey'
                            : 'red',
                  },
                ]}>
                <Text
                  style={[
                    styles.time,
                    {
                      color: 'white',
                      fontSize: RFValue(10),
                    },
                  ]}>
                  {item.payment_status}
                </Text>
              </Badge>
            </View>
          </View>
        </Card>
        {/* { ? */}
          <Checkbox 
          isDisabled={!checkStatus}
            onChange={() => addAmount(item.child_service_id, Number(item.total_price))}
            alignSelf={'center'}
            mt={3} mr={2} value="test" accessibilityLabel="This is a dummy checkbox" /> 
        {/* } */}
      </HStack>
    )
  }

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        { text: 'OK', onPress: () => setError(null) },
      ]);
    }
  }, [error]);




  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <View style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <Searchbar
            placeholder={t('search')}
            onChangeText={_onSearchHandler}
            value={search}
            style={styles.textInputStyle}
          />
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={Colors.primary}
            style={styles.indicator}
          />
        ) : sameBookingList.length === 0 ? (
          <Text style={styles.activity}>{t('noBook')}</Text>
        ) : (
          <View >

            <FlatList
           
              showsVerticalScrollIndicator={false}
              data={sameBookingList}
              keyExtractor={(item, index) => item.index?.toString()}
              renderItem={_renderItem}
            />
            <Text style={{marginHorizontal:14,color:'grey'}}>*You can only select a service for which the service status is currently accepted.</Text>
          </View>
        )}
      </View>
      <View style={{backgroundColor:'whitesmoke'}}> 

      {totalAmount !== 0 &&
        <Box justifyContent={'flex-end'} borderWidth={1} m={2} minH={180} backgroundColor={'white'} borderColor={'silver'} rounded={10}>
          {initLoading ?
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={styles.indicator}
            />
            :
            <>
              <Text style={{
                color: Colors.primary,
                textDecorationLine: 'underline',
                textAlign: 'center',
                padding: 10,
                fontSize: 18
              }}>{t('bilDetails')}</Text>
              <View style={styles.rowStyle2}>
                <Text style={styles.title5}>
                  {t('wallet') +
                    '( ' +
                    initData?.currency +
                    ' ' +
                    initData?.point_wallet +
                    ' )\n'}
                  {/* wallet */}
                  <Text style={styles.note}>
                    {'( ' +
                      t('walletYou') +
                      ' ' +
                      '11' +
                      '%' +
                      t('walletTotal') +
                      ' )'}
                  </Text>
                </Text>
                <check.Android
                  status={walletCheck ? 'checked' : 'unchecked'}
                  onPress={() => setWalletChecked(!walletCheck)}
                  color={Colors.primary}
                // disabled={orderDetails.wallet === '0.00'}
                />
              </View>

              <View style={styles.rowStyle2}>
                <Text style={styles.title5}>
                  {t('refundWallet') +
                    '( ' +
                    initData?.currency +
                    ' ' +
                    initData?.refund_wallet +
                    ' )\n'}
                </Text>
                <check.Android
                  status={refundWalletCheck ? 'checked' : 'unchecked'}
                  onPress={() => setRefundWalletChecked(!refundWalletCheck)}
                  color={Colors.primary}
                // disabled={orderDetails.refund_wallet === '0.00'}
                />
              </View>
              <HStack my={2} mx={4} justifyContent={'space-between'}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.primary }}>Service Total</Text>
                <Text style={{ fontSize: 16, fontWeight: '700' }}><Text style={{}}>INR</Text> {initData?.total_price}</Text>
              </HStack>
              <HStack my={2} mx={4} justifyContent={'space-between'}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.primary }}>{`Vat (${initData?.vat_percent}%)`}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700' }}>+{initData?.vat}</Text>
              </HStack>
              <HStack my={2} mx={4} justifyContent={'space-between'}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: Colors.primary }}>Total Amount</Text>
                <Text style={{ fontSize: 16, fontWeight: '700' }}><Text style={{}}>INR</Text>{' '}{initData?.total_amount}</Text>
              </HStack>
              <Divider />
              <Button isLoading={payLoading} isDisabled={payLoading} onPress={onPayHandler} mx={4} m={2}>Pay</Button>
            </>
          }
        </Box>
      }
            </View>


    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  containerStyle: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(20),
  },
  heading: {
    color: Colors.white,
    paddingLeft: RFValue(15),
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: RFValue(16),
    color: Colors.black,
    fontWeight: 'bold',
  },
  cardContainer: {
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: RFValue(5),
    flex: 1
  },
  rowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: RFValue(3),
  },
  type: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: Colors.black,
  },
  time: {
    fontSize: RFValue(12),
    color: Colors.black,
  },
  time1: {
    fontSize: RFValue(12),
    color: Colors.black,
    fontWeight: 'bold',
  },
  type1: {
    fontSize: RFValue(13),
    color: Colors.black,
  },
  type2: {
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: 'red',
  },
  group: {
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
  },
  service_name: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    // marginBottom: RFValue(5),
    textAlign: 'center',
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: RFValue(250),
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: RFValue(5),
  },
  textInputStyle: {
    width: '100%',
  },
  iconStyle: {
    paddingHorizontal: RFValue(7),
    paddingVertical: RFValue(10),
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
  note: {
    fontSize: RFValue(10),
    color: Colors.grey,
    fontStyle: 'italic',
  },
});

export default SameBookingRequest;
