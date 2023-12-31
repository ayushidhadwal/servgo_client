import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Platform} from 'react-native';
import {
  Box,
  Pressable,
  Text,
  FlatList,
  Button,
  HStack,
  Icon,
  Input,
  VStack,
} from 'native-base';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';
import dayjs from 'dayjs';

import timeList from '../../data/time';
import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import * as userActions from '../../store/actions/user';
import {Loader} from '../../components/common/Loader';
import {useError} from '../../hooks/useError';

const SlotBookingScreen = ({navigation, route}) => {
  const {service, subService, childService, addressId} = route.params;
  console.log(service, subService, childService, addressId)

  const dispatch = useDispatch();
  const setError = useError();

  const {t} = useTranslation('langChange');
  const {addresses} = useSelector(state => state.address);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [locate, setLocate] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(null);
  const [visible, setVisible] = useState(false);
  const [qty, setQty] = useState('1');

  const _onSubmitHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(
        requestAction.getServiceProviderList({
          service,
          subService,
          date,
          time,
          qty,
          addressId,
          childService,
        }),
      );
      navigation.navigate('ServiceProviders', {
        serviceId: service,
        bookingDate: dayjs(date).format('YYYY-MM-DD'),
        bookingTime: time,
        qty,
        addressId,
        subService,
        childService,
      });
    } catch (e) {
      setError(e.message);
    }

    setIsLoading(false);
  }, [
    setError,
    dispatch,
    service,
    subService,
    date,
    time,
    childService,
    qty,
    addressId,
    navigation,
    childService,
    subService
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(userActions.get_user_profile());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  useEffect(() => {
    const add = addresses.find(m => m.isDefault === true);
    if (add) {
      setLocate({...add});
    }
  }, [addresses]);

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView flex={1} edges={['bottom']}>
      <Pressable
        backgroundColor={'rgba(33, 109, 158, 0.3)'}
        p={2}
        onPress={() => navigation.navigate('AddressBook')}>
        <Box flexDirection={'row'} alignItems={'center'}>
          <MaterialCommunityIcons
            name="map-marker-radius"
            size={24}
            color="black"
            style={{marginRight: 5}}
          />
          <Text
            numberOfLines={1}
            color={'black'}
            fontSize={'sm'}
            flexShrink={1}>
            {locate.isDefault
              ? locate.address +
                ',' +
                ' ' +
                locate.cityName +
                ',' +
                ' ' +
                locate.countryName
              : t('pleaseAddAddress')}
          </Text>
        </Box>
      </Pressable>
      <Text fontWeight={'bold'} fontSize={'lg'} p={3}>
        {t('whenWould')}
      </Text>
      <HStack mx={2} justifyContent={'space-between'}>
        <Button
          leftIcon={<Icon as={Ionicons} name="md-calendar" size="sm" />}
          variant={'solid'}
          size={'md'}
          w={'48%'}
          bg={'primary.400'}
          _pressed={{
            _text: {color: 'muted.100'},
            bg: 'primary.400:alpha.80',
          }}
          onPress={() => setVisible(true)}>
          {t('bookDate')}
        </Button>
        <DatePicker
          mode="date"
          androidVariant="iosClone"
          theme={'light'}
          modal
          open={visible}
          minimumDate={new Date()}
          date={date}
          onConfirm={date => {
            setVisible(false);
            setDate(date);
            setTime(null);
          }}
          onCancel={() => {
            setVisible(false);
          }}
        />
        <Box
          py={2}
          px={1}
          borderWidth={1}
          borderColor={Colors.primary}
          borderRadius={5}
          backgroundColor={Colors.white}
          alignItems={'center'}
          w={'48%'}>
          <Text fontSize={'sm'}>{dayjs(date).format('ddd , DD MMM YYYY')}</Text>
        </Box>
      </HStack>
      <HStack
        bg={'white'}
        px={3}
        py={2}
        my={2}
        alignItems={'center'}
        justifyContent={'center'}>
        <Ionicons
          name={Platform.OS === 'ios' ? 'ios-time-outline' : 'md-time-outline'}
          size={RFValue(24)}
        />
        <Box pl={4} justifyContent={'center'}>
          <Text fontWeight={'bold'}>{t('selectTime')} </Text>
        </Box>
      </HStack>
      <FlatList
        showsVerticalScrollIndicator={true}
        keyExtractor={item => item.id.toString()}
        data={timeList}
        renderItem={({item}) => (
          <Button
            variant="outline"
            alignSelf={'center'}
            size={'md'}
            w={'45%'}
            borderRadius={5}
            mb={1}
            ml={3}
            _pressed={{
              _text: {color: 'muted.800'},
              bg: 'primary.400:alpha.80',
            }}
            backgroundColor={
              item.time === time ? 'rgba(34, 110, 160, 0.7)' : 'white'
            }
            onPress={() => setTime(item.time)}
            isDisabled={
              dayjs(date).format('ddd , DD MMM YYYY') ===
                dayjs(new Date()).format('ddd , DD MMM YYYY') &&
              item.time <= dayjs(new Date()).format('HH:mm')
            }>
            {item.time}
          </Button>
        )}
        numColumns={2}
      />
      <HStack
        px={5}
        py={5}
        bg={'#fff'}
        alignItems={'center'}
        justifyContent={'space-between'}>
        <VStack w={'25%'}>
          <Text>{t('qty')}</Text>
          <Input
            variant="outline"
            size={'sm'}
            p={Platform.OS === 'ios' ? 2 : 1}
            value={qty}
            onChangeText={setQty}
          />
        </VStack>
        <Button
          variant="solid"
          alignSelf={'center'}
          isLoading={isLoading}
          w={'65%'}
          _loading={{
            _text: {
              color: 'coolGray.700',
            },
          }}
          _spinner={{
            color: 'white',
          }}
          size={'lg'}
          onPress={_onSubmitHandler}
          isDisabled={isLoading || !time || parseInt(qty) <= 0 || !qty}>
          {t('contBtn')}
        </Button>
      </HStack>
    </SafeAreaView>
  );
};

export const screenOptions = () => ({
  headerTitle: i18n.t('langChange:bookSlot'),
});

export default SlotBookingScreen;
