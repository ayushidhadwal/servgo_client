import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ScrollView,
  StyleSheet,

  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Button,
  Divider,
  Subheading,
  TextInput,
  Title,
} from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import ProviderRating from '../../components/ProviderRating';
import { IMG_URL, PROVIDER_GALLERY } from '../../constants/base_url';
import { useError } from '../../hooks/useError';
import { Image } from '../../components/Image';
import { Loader } from '../../components/common/Loader';
import ServiceItem from './components/ServiceItem';
import {
  FlatList, Text,
  VStack,
  View,
} from 'native-base';
import { SUB_IMG_URL } from '../../constants/base_url';
import { successMessage } from '../../utils/message';

const ServiceProviderProfileScreen = ({ route, navigation }) => {
  const { partnerId, bookingDate, bookingTime, qty, addressId, serviceId, childService, selectedId, } =
    route.params;


  const { t } = useTranslation('langChange');

  

  const { providerProfile, subService, partnerServices } = useSelector(state => state.request);

  const { childServices } = useSelector(state => state.home);

  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [filteredService, setFilteredService] = useState([]);
  const [moreService, setMoreService] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [quantity, setQuantity] = useState(qty);
  const [vendorServiceId, setVendorServiceId] = useState()

  console.log(quantity)

  const dispatch = useDispatch();
  const setError = useError();


  useEffect(() => {

    const getPartnerServices = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.get_partner_service(serviceId))
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    getPartnerServices();


  }, [serviceId])



  useEffect(() => {
    const f = providerProfile.servicePricing.filter(
      s => s.child_service_id === childService,
    );

    const moreServ = childServices?.filter(
      m => m.id !== childService
    )
    setMoreService(moreServ)

    if (f.length > 0) {
      setVendorServiceId(f[0].id)
      setFilteredService(f);
      setVendorId(f[0].vendor_id);
      setBranchId(f[0].branch_id);
      setServicePrice(f[0].service_price);
    }
  }, [providerProfile, subService, childService]);

  useEffect(() => {

    const getDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(
          requestAction.getServiceProviderProfile(
            partnerId,
            bookingDate,
            bookingTime,
            qty,
            addressId,
            serviceId,
          ),
        );
        await dispatch(requestAction.getServiceProviderReview(partnerId));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    }

    getDetails();

  }, [
    addressId,
    bookingDate,
    bookingTime,
    dispatch,
    navigation,
    partnerId,
    qty,
    serviceId,
    setError,
  ]);

  const _onSubmitHandler = useCallback(async () => {
    setBtnLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.serviceAddToCart(
          branchId,
          partnerId,
          addressId,
          bookingDate,
          bookingTime,
          vendorServiceId,
          servicePrice,
          quantity,
          instructions,
          serviceId,
          childService
        ),
      );
      successMessage('Added to cart Successfully')
      // navigation.navigate('Home');
      // navigation.navigate('CartScreen');
    } catch (e) {
      setError(e.message);
    }

    setBtnLoading(false);
  }, [
    setError,
    dispatch,
    branchId,
    partnerId,
    addressId,
    bookingDate,
    bookingTime,
    vendorServiceId,
    servicePrice,
    quantity,
    instructions,
    navigation,
  ]);

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('SubCategories', {
            serviceId: item.id,
            serviceNameEN: item.en_service_name,
            serviceNameAR: item.ar_service_name,
            serviceIndex: index,
            bookingTime: bookingTime,
            addressId: addressId,
            qty: qty,
            bookingDate: bookingDate,
            partnerId: partnerId,
            selectedId: selectedId
          })
        }
      >
        <VStack pl={3} mt={2} alignItems={'center'} space={1} mx={2}>
          <Image
            source={{ uri: IMG_URL + item.service_icon }}
            style={{ alignItems: 'center', height: 40, width: 40, borderRadius: 20 }}
            resizeMode="cover"
          />
          <Text fontSize={'sm'}>{item.en_service_name}</Text>
        </VStack>
      </Pressable>
    )
  }


  return (
    <ScrollView style={styles.screen}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <View style={styles.imgContainer}>
            <Image
              source={{
                uri: PROVIDER_GALLERY + providerProfile.profile.photo,
              }}
              style={styles.img}
              zoom={true}
            />
          </View>
          <Text style={styles.company_name}>
            {providerProfile.profile.company_name}
          </Text>
          <Title style={styles.heading1}>{t('overview')} :</Title>
          <Text style={styles.text1}>{providerProfile.profile.overview}</Text>
          {/* <Title style={styles.heading1}>{t('moreService')} : </Title>
          {providerProfile.services.map((item, id) => (
            <View key={id} style={styles.star}>
              <Ionicons
                name="ios-arrow-redo"
                size={15}
                color={Colors.primary}
              />
              <Text style={styles.serviceName}>{item.en_service_name}</Text>
            </View>
          ))} */}
          {quantity !== 0 &&
            <Title style={styles.heading2}>{t('prices')} : </Title>
          }
          <Divider style={styles.line} />

          {quantity !== 0 && filteredService.map((item, index) => {

            return (
              <View
                key={index}
                style={[
                  styles.price,
                  { backgroundColor: index % 2 ? '#fff' : '#f9f9f9' },
                ]}
              >
                <View style={styles.content3}>
                  <Text style={styles.text2}>
                    {item.main_cat} - {item.en_subcategory_name}
                    {item.en_child_category_name !== null
                      ? ' - ' + item.en_child_category_name
                      : null}
                  </Text>
                </View>

                <Text style={styles.description}>{item.service_desc}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: Colors.primary,
                      padding: 5,
                      borderRadius: 5,
                      marginLeft:6
                    }}>
                    <Pressable
                      onPress={() => {
                        quantity > 0 && setQuantity(Number(quantity) + 1);
                      }}>
                      <AntDesign name="plus" size={16} color="white" />
                    </Pressable>
                    <Text
                      style={{
                        fontSize: 15,
                        paddingHorizontal: 5,
                        color: 'white',
                      }}>
                      {Number(quantity)}
                    </Text>
                    <Pressable
                      onPress={() => {
                        quantity > 0 && setQuantity(Number(quantity) - 1);
                      }}>
                      <AntDesign name="minus" size={20} color="white" />
                    </Pressable>
                  </View>
                  <Text  style={styles.text3}>
                    {providerProfile.currency}{' '}
                    {(Number(item.service_price) * quantity).toFixed(2)}
                  </Text>
                  {/*) : null}*/}
                </View>
              </View>

            )
          }

          )}


          <Divider />
          <View style={{ padding: RFValue(10) }}>
            <Subheading>{t('instIfAny')}</Subheading>
            <TextInput
              label={t('Instructions')}
              mode="outlined"
              multiline={true}
              style={styles.inputBox}
              value={instructions}
              onChangeText={setInstructions}
            />
            <Button
              mode="contained"
              style={{
                width: '80%',
                marginVertical: RFValue(20),
                alignSelf: 'center',
              }}
              onPress={() => _onSubmitHandler()}
              disabled={btnLoading || quantity == 0}
              loading={btnLoading}
              >
              Add to Cart
            </Button>
          </View>

          <Divider />
          <View my={4}>
            <Text mb={2} style={{ color: 'black', paddingLeft: 15, fontSize: 21 }}>{t('More services')}</Text>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              data={partnerServices}
              renderItem={renderItem} />
          </View>
          <Divider />

          <Title style={{ marginHorizontal: RFValue(15) }}>{t('gallery')}</Title>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              margin: RFValue(15),
            }}>
            {providerProfile.gallery.map(img => (
              <View key={img?.image_path} style={styles.imgDesign}>
                <Image
                  source={{ uri: PROVIDER_GALLERY + img.image_path }}
                  style={styles.img}
                  zoom={true}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
          <Divider />
          <ProviderRating />
          <Divider style={{ marginTop: RFValue(10) }} />
          <Pressable
            style={styles.content2}
            onPress={() => navigation.navigate('ProviderReview')}>
            <Text style={styles.review}>{t('seeAllRev')}</Text>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </Pressable>
          <Divider style={{ marginBottom: RFValue(25) }} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(10),
  },
  review: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  star: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    marginBottom: 2,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('24%'),
    borderBottomWidth: 1,
    borderBottomColor: '#cdcdcd',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  company_name: {
    textAlign: 'center',
    paddingVertical: RFValue(10),
    fontSize: RFValue(24),
    color: Colors.primary,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  heading1: {
    paddingHorizontal: RFValue(10),
    color: '#f54254',
    fontSize: 17,
  },
  text1: {
    paddingHorizontal: RFValue(10),
    paddingBottom: RFValue(10),
    fontSize: 17,
    marginLeft:20
  },
  serviceName: {
    fontSize: 15,
    paddingLeft: RFValue(10),
    paddingTop: RFValue(5),
  },
  heading2: {
    paddingHorizontal: RFValue(10),
    color: '#f54254',
    fontSize: 15,
  },
  line: {
    backgroundColor: '#f54254',
    marginHorizontal: RFValue(10),
    marginBottom: RFValue(5),
  },
  price: {
    padding: RFValue(15),
  },
  content3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: RFValue(10),
  },
  text2: { fontSize: 15 },
  text3: {
    color: Colors.primary,
    fontSize: RFValue(15),
    marginRight:5
  },
  description: {
    color: Colors.grey,
    fontSize: RFValue(13),
    paddingHorizontal: RFValue(10),
    paddingBottom: RFValue(5),
  },
  icon: { paddingTop: RFValue(5) },
  imgDesign: {
    width: (Dimensions.get('screen').width * 20) / 100,
    height: (Dimensions.get('screen').width * 20) / 100,
    marginRight: RFValue(6),
    marginBottom: RFValue(6),
    borderWidth: RFValue(1),
    borderColor: '#808080',
  },
});

export default ServiceProviderProfileScreen;
