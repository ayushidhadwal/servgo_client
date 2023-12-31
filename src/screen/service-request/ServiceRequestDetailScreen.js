import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  FlatList,
  I18nManager,
} from 'react-native';
import {Button, Divider, Subheading, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import dayjs from 'dayjs';
import {Row, Rows, Table} from 'react-native-table-component';
import i18n from 'i18next';
import DatePicker from 'react-native-date-picker';
import {SafeAreaView} from 'react-native-safe-area-context';

import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import timeList from '../../data/time';
import JobDescription from '../../components/JobDescription';
import {Loader} from '../../components/common/Loader';
import {useError} from '../../hooks/useError';

const TextRow = ({heading, text, color}) => (
  <Text style={[styles.bold, {marginBottom: RFValue(5)}]}>
    {heading}:{' '}
    <Text style={[styles.normal, {color: color ? color : 'black'}]}>
      {text}
    </Text>
  </Text>
);

const ServiceRequestDetailScreen = ({navigation, route}) => {
  const {booking_id,service_id,child_service_id} = route.params.providerDetails;
  // console.log(booking_id,service_id,child_service_id)

  const setError = useError();
  const {user_id} = useSelector(state => state.auth);
  const {serviceOrdered} = useSelector(state => state.request);
  const {lang} = useSelector(state => state.lang);

  const tableHead = [
    i18n.t('langChange:serviceTable'),
    i18n.t('langChange:priceTable'),
    i18n.t('langChange:qtyTable'),
    i18n.t('langChange:totalTable'),
  ];

  const tableData = serviceOrdered.serviceDetails.map(m => {
    const service = `${m[`${lang}_service_name`]}, ${
      m[`${lang}_subcategory_name`]
    }, ${m[`${lang}_child_category_name`]},\n(${m.service_desc})`;

    const price = `${serviceOrdered.currency} ${m.st_service_price}`;
    const qty = Number(m.st_qty);
    const total = (Number(m.st_service_price) * qty).toFixed(2);
    const totalPrice = `${serviceOrdered.currency} ${total}`;

    return [service, price, qty, totalPrice];
  });

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [status, setStatus] = useState('PENDING');
  const [loading, setLoading] = useState(true);
  const [reLoading, setReLoading] = useState(false);
  const [booking, setBooking] = useState({
    provider_img: '',
    company_name: '',
    provider_email: '',
    service_name: '',
    sub_service_name: '',
    booking_date_time: '',
    service_price: '',
    service_status: '',
    provider: '',
    provider_mobile: '',
    provider_phonecode: '',
    total_price: '',
    payment_status: '',
    reject_reason: '',
    review_status: '',
    qty: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  const showDatePicker = () => setVisible(true);

  const {
    provider_img,
    company_name,
    provider_email,
    booking_date_time,
    provider,
    provider_mobile,
    provider_phonecode,
    total_price,
    payment_status,
    reject_reason,
    review_status,
  } = booking;

  const dispatch = useDispatch();
  const {bookingList} = useSelector(state => state.request);

  useEffect(() => {
    const b = bookingList.find(b => {
      return b.booking_id === booking_id && b.service_id===service_id && b.child_service_id === child_service_id
    });
    console.log(b)
    if (bookingList) {
      setBooking({
        ...b,
      });
      setStatus(b.service_status);
      setModalVisible(b.service_status === 'RESCHEDULE');
    }
  }, [bookingList, booking_id]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          dispatch(requestAction.get_booking()),
          dispatch(requestAction.getOrderDetails(booking_id,service_id,child_service_id)),
        ]);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [booking_id, dispatch, navigation, setError]);

  const _cancelRequestHandler = async () => {
    Alert.alert(
      i18n.t('langChange:alertReqTitle'),
      i18n.t('langChange:alertReqMsg'),
      [
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            setError(null);

            try {
              await dispatch(requestAction.cancel_request(booking_id));
              setStatus('CANCELLED');
            } catch (e) {
              setError(e.message);
            }
            setLoading(false);
          },
        },
        {
          text: 'Cancel',
        },
      ],
    );
  };

  const _rescheduleBooking = async () => {
    setReLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.rescheduleBooking(
          booking_id,
          provider,
          dayjs(date).format('YYYY-MM-DD'),
          time,
        ),
      );
      setModalVisible(false);
      setStatus('PENDING');
    } catch (e) {
      setError(e.message);
    }
    setReLoading(false);
  };

  const isCancellationAllowed = dayjs()
    .add(24, 'hours')
    .isBefore(dayjs(booking_date_time, 'MMM DD, YYYY hh:mm a'));

  if (loading) {
    return <Loader />;
  }

  return (
    <ScrollView style={styles.screen}>
     
      <SafeAreaView edges={['bottom']}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <DatePicker
              mode="date"
              androidVariant="iosClone"
              theme={'light'}
              modal
              open={visible}
              minimumDate={new Date()}
              date={date}
              onConfirm={d => {
                setVisible(false);
                setDate(d);
                setTime(null);
              }}
              onCancel={() => {
                setVisible(false);
              }}
            />
            <View style={styles.modalContainer}>
              <View>
                <Subheading style={{fontWeight: 'bold', textAlign: 'center'}}>
                  {i18n.t('langChange:bookResch')}
                </Subheading>
                <Divider style={{marginVertical: RFValue(5)}} />
                <TextRow
                  heading="Rejected Request Reason"
                  text={reject_reason}
                />
              </View>

              <View style={{maxHeight: hp('50%')}}>
                <Pressable onPress={showDatePicker}>
                  <View pointerEvents="none">
                    <TextInput
                      left={
                        <TextInput.Icon name="calendar" color={Colors.grey} />
                      }
                      mode={I18nManager.isRTL ? 'outlined' : 'flat'}
                      maxLength={16}
                      label="Select Date"
                      minimumDate={new Date()}
                      value={date.toDateString()}
                      editable={false}
                      style={{
                        backgroundColor: 'white',
                        marginBottom: RFValue(10),
                      }}
                    />
                  </View>
                </Pressable>
                <FlatList
                  showsVerticalScrollIndicator={true}
                  data={timeList}
                  keyExtractor={item => item.id.toString()}
                  renderItem={({item}) => (
                    <Button
                      mode="outlined"
                      style={[
                        styles.btn,
                        item.time === time
                          ? {backgroundColor: 'rgba(34, 110, 160, 0.4)'}
                          : null,
                      ]}
                      contentStyle={{height: RFValue(45)}}
                      onPress={() => setTime(item.time)}
                      disabled={
                        dayjs(date).format('ddd , DD MMM YYYY') ===
                          dayjs(new Date()).format('ddd , DD MMM YYYY') &&
                        item.time <= dayjs(new Date()).format('HH:mm')
                      }>
                      {item.time}
                    </Button>
                  )}
                  numColumns={2}
                />
              </View>

              <Divider style={{marginVertical: RFValue(5)}} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Button
                  onPress={_rescheduleBooking}
                  uppercase={false}
                  color="green"
                  mode="contained"
                  loading={reLoading}
                  disabled={reLoading}>
                  {i18n.t('langChange:reqResch')}
                </Button>
                <Button
                  onPress={_cancelRequestHandler}
                  color="red"
                  mode="contained"
                  uppercase={false}>
                  {i18n.t('langChange:cancelBook')}
                </Button>
              </View>
              <Button
                onPress={() => {
                  setModalVisible(false);
                  navigation.goBack();
                }}
                style={{marginTop: RFValue(5)}}
                mode="contained">
                {i18n.t('langChange:closeBtn')}
              </Button>
            </View>
          </View>
        </Modal>

        <View style={styles.imgContainer}>
          <Image source={{uri: provider_img}} style={styles.img} />
        </View>

        <View style={styles.contactsContainer}>
          <Text style={styles.companyName}>{company_name}</Text>
        </View>

        {(status === 'ACCEPTED' || status === 'COMPLETED') &&
          payment_status === 'SUCCESS' && (
            <View style={styles.card}>
              <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
                {i18n.t('langChange:contDetails')}
              </Text>
              <Divider style={styles.marginVertical} />
              <Text style={{marginBottom: RFValue(5)}}>
                {provider_email.toLowerCase()}
              </Text>
              <Text>{`${provider_phonecode}-${provider_mobile}`}</Text>
            </View>
          )}

        <View style={[styles.card, {marginVertical: RFValue(10)}]}>
          <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
            {i18n.t('langChange:serviceDetails')}
          </Text>
          <Divider style={styles.marginVertical} />
          <TextRow heading={i18n.t('langChange:bookId')} text={booking_id} />
          <TextRow
            heading={i18n.t('langChange:dateAndTime')}
            text={booking_date_time}
          />
          <TextRow
            heading={i18n.t('langChange:fees')}
            text={`${serviceOrdered.currency} ${total_price}`}
          />
          {!serviceOrdered.booking_details.booking_comment ? null : (
            <TextRow
              heading={i18n.t('langChange:inst')}
              text={serviceOrdered.booking_details.booking_comment}
            />
          )}
          {reject_reason && (
            <TextRow
              heading={i18n.t('langChange:instBy')}
              text={reject_reason}
            />
          )}
          <TextRow
            heading={i18n.t('langChange:bookStatus')}
            text={status}
            color={
              status === 'ACCEPTED' || status === 'COMPLETED'
                ? 'green'
                : status === 'REFUND'
                ? 'orange'
                : status === 'PENDING'
                ? 'grey'
                : status === 'RESCHEDULE'
                ? 'skyblue'
                : 'red'
            }
          />
          <TextRow
            heading={i18n.t('langChange:paymentStatus')}
            text={payment_status}
            color={
              payment_status === 'SUCCESS'
                ? 'green'
                : payment_status === 'REFUND'
                ? 'orange'
                : payment_status === 'PENDING'
                ? 'grey'
                : 'red'
            }
          />
          {status === 'RESCHEDULE' && (
            <TextRow
              heading="Rejected Reason"
              text={reject_reason}
              color="red"
            />
          )}
          <View>
            <Text style={[styles.bold, {fontSize: RFValue(13)}]}>
              {i18n.t('langChange:details')} :
            </Text>
            <Divider style={styles.marginVertical} />
            <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
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
          </View>
          {(status === 'ACCEPTED' || status === 'RESCHEDULE') &&
            payment_status === 'SUCCESS' && (
              <Button
                mode={'contained'}
                style={styles.chatStyle}
                icon={'chat'}
                onPress={() =>
                  navigation.navigate('message', {
                    companyName: company_name,
                    bookingId: booking_id,
                    partnerId: serviceOrdered.booking_details.vendor_id,
                    userId: user_id,
                  })
                }>
                {i18n.t('langChange:chatBtn')}
              </Button>
            )}
        </View>
        {status === 'COMPLETED' && payment_status === 'SUCCESS' && (
          <Button
            mode={'contained'}
            style={styles.invoiceStyle}
            onPress={() => navigation.navigate('invoice')}>
            {i18n.t('langChange:invoiceBtn')}
          </Button>
        )}
        {/*Job Completed Description*/}
        <JobDescription
          status={status}
          payment_status={payment_status}
          bookingId={booking_id}
          navigation={navigation}
          confirmStatus={serviceOrdered.booking_details.confirm_status}
          confirmUserStatus={serviceOrdered.booking_details.confirm_reason}
          confirmUserImages={serviceOrdered.serviceConfirmation}
        />
        {/* Complaint details */}
        {status === 'COMPLETED' && serviceOrdered.complaints.cr_comment ? (
          <View style={[styles.card, {marginVertical: RFValue(10)}]}>
            <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
              {i18n.t('langChange:yourComplaint')}
            </Text>
            <Divider style={styles.marginVertical} />
            <TextRow
              heading={i18n.t('langChange:subj')}
              text={serviceOrdered.complaints.cr_subject}
            />
            <TextRow
              heading={i18n.t('langChange:comment')}
              text={serviceOrdered.complaints.cr_comment}
            />
            {serviceOrdered.complaints.feedback && (
              <TextRow
                heading={i18n.t('langChange:feedback')}
                text={serviceOrdered.complaints.feedback}
              />
            )}
          </View>
        ) : null}

        {!isCancellationAllowed ? (
          <Text style={{color: 'red', textAlign: 'center'}}>
            You can only cancel request before 24 hours.
          </Text>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginHorizontal: RFValue(8),
          }}>
          <Button
            icon="cancel"
            mode="contained"
            color="red"
            style={styles.button}
            disabled={
              status === 'REJECTED' ||
              status === 'CANCELLED' ||
              status === 'COMPLETED' ||
              loading ||
              !isCancellationAllowed
            }
            loading={loading}
            onPress={_cancelRequestHandler}>
            {i18n.t('langChange:cancelBtn')}
          </Button>
          <Button
            icon="comment-check-outline"
            mode="contained"
            style={styles.button}
            disabled={
              status === 'PENDING' ||
              status === 'REJECTED' ||
              status === 'ACCEPTED' ||
              status === 'CANCELLED' ||
              status === 'RESCHEDULE' ||
              review_status === true
            }
            onPress={() =>
              navigation.navigate('PostReview', {
                provider: provider,
                booking_id,
              })
            }>
            {i18n.t('langChange:postRevBtn')}
          </Button>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            icon="cash"
            mode="contained"
            color="green"
            style={styles.button}
            disabled={
              payment_status === 'FAILED' ||
              payment_status === 'REFUND' ||
              payment_status === 'SUCCESS' ||
              status === 'PENDING' ||
              status === 'REJECTED' ||
              status === 'CANCELLED' ||
              status === 'COMPLETED' ||
              status === 'RESCHEDULE'
            }
            onPress={() =>
              navigation.navigate('Order', {
                bookingId: booking_id,
              })
            }>
            {i18n.t('langChange:payBtn')}
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  imgContainer: {
    height: hp('25%'),
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  content: {
    padding: RFValue(10),
  },
  companyName: {
    textAlign: 'center',
    color: Colors.black,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: RFValue(15),
  },
  email: {
    textAlign: 'center',
    color: Colors.black,
    fontSize: RFValue(15),
  },
  service_name: {
    color: Colors.black,
    fontWeight: 'bold',
    fontSize: RFValue(14),
    marginVertical: RFValue(5),
  },
  type: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: RFValue(13),
    color: Colors.black,
  },
  time: {
    fontSize: RFValue(13),
    color: Colors.black,
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
  contactsContainer: {
    padding: RFValue(5),
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  normal: {
    fontWeight: 'normal',
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
  button: {
    margin: RFValue(4),
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    marginHorizontal: RFValue(8),
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: RFValue(12),
  },
  btn: {
    width: '45%',
    borderRadius: RFValue(5),
    marginBottom: RFValue(8),
    marginHorizontal: RFValue(9),
    backgroundColor: Colors.white,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: RFValue(10),
  },
  imgDesign: {
    width: RFValue(90),
    height: RFValue(90),
    marginRight: RFValue(10),
    marginBottom: RFValue(10),
    borderWidth: 1 / 2,
    borderColor: '#cacbcc',
  },
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  chatStyle: {
    width: '40%',
    alignSelf: 'flex-end',
    marginLeft: RFValue(10),
    marginTop: RFValue(10),
    borderRadius: RFValue(10),
  },
  invoiceStyle: {
    width: '40%',
    alignSelf: 'flex-end',
    marginRight: RFValue(10),
    marginBottom: RFValue(10),
  },
  //
  head: {height: 40, backgroundColor: '#f1f8ff'},
  text: {margin: 6, fontSize: RFValue(11)},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
});

export default ServiceRequestDetailScreen;
