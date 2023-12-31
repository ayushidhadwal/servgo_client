import { View, Text, FlatList } from 'native-base'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as requestAction from '../../store/actions/request'
import { StatusBar, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'
import { Badge, Card } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
} from 'react-native';



const ServiceRequestScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null);


  const { t } = useTranslation()

  const dispatch = useDispatch();

  const { sameBookingList } = useSelector(state => state.request);







  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true)
      setError(null);
      try {
        await dispatch((requestAction.get_booking_list()))
      } catch (error) {
        setError(error.message);
      }

      setLoading(false);
    })

    return unsubscribe
  }, [navigation, dispatch])


  const _renderItem = ({ item, index }) => (
    <Card
      style={[styles.cardContainer, index === 0 && { marginTop: RFValue(10) }]}
      onPress={() => {
        navigation.navigate('SameBooking', { bookingId: item.booking_id })
        console.log("dfjio")
      }
      }
    >
      <View style={styles.group}>
        <View style={styles.rowStyle}>
          <Text style={styles.bold}>{t('bookId')}: </Text>
          <Text style={styles.time1}>{item.booking_id}</Text>
        </View>
        <View style={styles.rowStyle}>
          <Text style={styles.bold}>{t('bookTime')}: </Text>
          <Text style={styles.time}>{item.created_at}</Text>
        </View>
      </View>
    </Card>
  );


  return (
    <View flex={1} bg={'white'}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.indicator}
        />):
        <FlatList
          showsVerticalScrollIndicator={false}
          data={sameBookingList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={_renderItem}
        />
      }
    </View>
  )
}

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
});


export default ServiceRequestScreen