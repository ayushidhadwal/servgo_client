import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, Text, View, StatusBar, FlatList} from 'react-native';
import {Card, Button, Searchbar} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18next';

import {Image} from '../../components/Image';
import Colors from '../../constants/Colors';
import {URL} from '../../constants/base_url';

const ServiceProvidersListScreen = ({route, navigation}) => {
  const {serviceProvider} = useSelector(state => state.request);

  const {serviceId, bookingDate, bookingTime, qty, addressId,subService,childService} = route.params;

  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFilteredList([...serviceProvider]);
  }, [serviceProvider]);

  const _onSearchHandler = searchText => {
    setFilteredList(
      serviceProvider.filter(
        item =>
          item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.service_price.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
    setSearch(searchText);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      <Searchbar
        placeholder={i18n.t('langChange:search')}
        onChangeText={_onSearchHandler}
        value={search}
        style={styles.textInputStyle}
      />
      {filteredList.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.activity}>{i18n.t('langChange:noService')}</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={serviceProvider}
          keyExtractor={item => String(item.id)}
          renderItem={({item, index}) => {
            console.log(URL + item.photo)
            const rating = item.rating || 5;

            return (
              <Card
                style={[
                  styles.cardContainer,
                  index === 0 && {marginTop: RFValue(10)},
                ]}>
                <View style={{flexShrink: 1}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={{uri: URL + item.photo}}
                      style={{
                        width: 50,
                        height: 50,
                        resizeMode: 'cover',
                        marginRight: 5,
                      }}
                    />
                    <Text style={styles.name}>{item.company_name}</Text>
                  </View>
                  <View style={styles.rowStyle}>
                    <View>
                      <Text style={styles.exp}>
                        <Text style={{fontWeight: 'bold'}}>
                          {i18n.t('langChange:price')}:
                        </Text>{' '}
                        {item.currency}{' '}
                        {Number(item.total_price) * Number(item.qty)} for{' '}
                        {item.qty}
                      </Text>

                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.review}>
                          {i18n.t('langChange:rev')}:
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            paddingTop: RFValue(3.5),
                          }}>
                          <Ionicons
                            name="md-star"
                            size={RFValue(16)}
                            color={
                              rating >= 1 ? Colors.darkYellow : Colors.grey
                            }
                          />
                          <Ionicons
                            name="md-star"
                            size={RFValue(16)}
                            color={
                              rating >= 2 ? Colors.darkYellow : Colors.grey
                            }
                          />
                          <Ionicons
                            name="md-star"
                            size={RFValue(16)}
                            color={
                              rating >= 3 ? Colors.darkYellow : Colors.grey
                            }
                          />
                          <Ionicons
                            name="md-star"
                            size={RFValue(16)}
                            color={
                              rating >= 4 ? Colors.darkYellow : Colors.grey
                            }
                          />
                          <Ionicons
                            name="md-star"
                            size={RFValue(16)}
                            color={
                              rating >= 5 ? Colors.darkYellow : Colors.grey
                            }
                          />
                        </View>
                      </View>

                      <View style={{marginVertical: 8}}>
                        <Text style={{marginBottom: 8}}>
                          <Text style={{fontWeight: 'bold'}}>Distance:</Text>{' '}
                          {item.distance}
                        </Text>

                        <Text>
                          <Text style={{fontWeight: 'bold'}}>Time:</Text>{' '}
                          {item.time}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.btnStyles}>
                      <Button
                        mode="outlined"
                        onPress={() =>
                          navigation.navigate('ServiceProviderProfile', {
                            selectedId: item.id,
                            partnerId: item.partner_id,
                            bookingDate,
                            bookingTime,
                            qty,
                            addressId,
                            serviceId,
                            childService
                          })
                        }
                        style={{alignSelf: 'flex-end'}}>
                        choose
                      </Button>
                    </View>
                  </View>
                </View>
              </Card>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(20),
    marginBottom: RFValue(15),
  },
  heading: {
    color: Colors.white,
    paddingLeft: RFValue(15),
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  cardContainer: {
    padding: RFValue(10),
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
    alignItems: 'center',
  },
  name: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: RFValue(15),
    flexShrink: 1,
  },
  exp: {
    paddingTop: RFValue(8),
    marginBottom: RFValue(5),
  },
  review: {
    paddingTop: RFValue(3),
    paddingRight: RFValue(5),
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activity: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnStyles: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  btn1: {
    alignSelf: 'center',
    width: '100%',
  },
});

export const screenOptions = () => ({
  headerTitle: i18n.t('langChange:serviceProviders'),
});

export default ServiceProvidersListScreen;
