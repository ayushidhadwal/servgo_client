import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Column,
  HStack,
  FlatList,
  Text,
  Pressable,
  VStack,
} from 'native-base';
import { useTranslation } from 'react-i18next';

import { useError } from '../../hooks/useError';
import * as homeAction from '../../store/actions/home';
import { SUB_IMG_URL } from '../../constants/base_url';
import { Loader } from '../../components/common/Loader';
import { Image } from '../../components/Image';
import { isNull } from '@notifee/react-native/src/utils';

const RowItem = ({ img, title }) => {
  return (
    <VStack alignItems={'center'}>
      <Image source={img} style={{ width: 50, height: 50 }} />
      <Text fontSize={'xs'} textAlign={'center'}>
        {title}
      </Text>
    </VStack>
  );
};

const SubCategoryScreen = ({ route, navigation }) => {
  const { serviceId, serviceNameEN, serviceNameAR, addressId, bookingTime, qty, bookingDate, selectedId, partnerId } = route.params;







  const { subServices, childServices } = useSelector(state => state.home);
  const { lang } = useSelector(state => state.lang);

  const dispatch = useDispatch();
  const setError = useError();

  const { t } = useTranslation('langChange');
  const flatListRef = useRef(null);

  const [serveName, setServeName] = useState(
    lang === 'en' ? serviceNameEN : serviceNameAR,
  );
  const [ind, setInd] = useState(null);
  const [subServiceId, setSubServiceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [childLoading, setChildLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: lang == 'en' ? serviceNameEN : serviceNameAR,
    });
  }, [navigation, serviceNameEN, serviceNameAR]);

  const setChildServices = useCallback(
    async (subId, i) => {
      setChildLoading(true);
      setError(null);
      setSubServiceId(subId);
      setInd(i);
      try {
        await dispatch(homeAction.setChildService(serviceId, subId));
      } catch (e) {
        setError(e.message);
      } finally {
        setChildLoading(false);
      }
    },
    [dispatch, serviceId, setError],
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setIsLoading(true);
      setError(null);

      try {
        await dispatch(homeAction.setSubService(serviceId));
      } catch (e) {
        setError(e.message);
      }
      setIsLoading(false);
    }
    );
    return unsubscribe;
  }, [navigation, serviceId, setError]);

  useEffect(() => {
    if (subServices.length > 0 && ind === null) {
      const [sub] = subServices;
      if (sub?.service_id === serviceId) {
        const [item] = subServices;
        setChildServices(item.id, 0);
      }
    }
  }, [subServices, subServiceId, setChildServices]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: ind });
    }
  }, [ind])

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Box flex={1} bg={'white'}>
      <HStack>
        <Column flex={2 / 3} bg={'white'} shadow={5}>
          <FlatList
            ref={flatListRef}
            data={subServices}
            keyExtractor={item => item.id.toString()}
            h={'100%'}
            showsVerticalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: 50,
              offset: 50 * index,
              index,
            })}
            renderItem={({ item, index }) => {
              return (
                <Pressable
                  alignItems={'center'}
                  mb={3}
                  borderRightColor={
                    ind === index ? 'primary.500' : 'white'
                  }
                  borderRightWidth={ind === index ? 4 : 0}
                  px={2}
                  mt={index === 0 ? 3 : 0}
                  onPress={() => setChildServices(item.id, index)}>
                  <Box
                    w={50}
                    h={50}
                    bg={
                      ind === index
                        ? 'rgba(33, 109, 158, 0.3)'
                        : '#e8e8e8'
                    }
                    p={1}
                    justifyContent={'center'}
                    borderRadius={'full'}>
                    <Image
                      source={{
                        uri: SUB_IMG_URL + item.image,
                      }}
                      style={{ width: '70%', height: '70%', alignSelf: 'center' }}
                      resizeMode="contain"
                    />
                  </Box>
                  <Text
                    textAlign={'center'}
                    fontSize={'xs'}
                    numberOfLines={2}
                    flexShrink={1}>
                    {lang === 'en'
                      ? item.en_subcategory_name
                      : item.ar_subcategory_name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </Column>
        <Column flex={2}>
          <Box flex={1}>
            <Box px={2} bg={'rgba(33, 109, 158, 0.3)'} py={1}>
              <Text p={1} fontSize={'md'} fontWeight={'bold'}>
                {t('bestInClass')}
              </Text>
              <HStack m={1} justifyContent={'space-between'}>
                <RowItem
                  img={require('../../assets/mask.png')}
                  title={t('maskMsg')}
                />
                <RowItem
                  img={require('../../assets/thermometer.png')}
                  title={t('tempMsg')}
                />
                <RowItem
                  img={require('../../assets/hand-sanitizer.png')}
                  title={t('santizeMsg')}
                />
              </HStack>
            </Box>
            {childLoading ? (
              <Loader />
            ) : childServices.length === 0 ? (
              <Box flex={1} alignItems="center" justifyContent="center">
                <Text>No Data</Text>
              </Box>
            ) : (
              <FlatList
                data={childServices}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <Pressable
                      key={index}
                      alignItems={'center'}
                      w={'45.5%'}
                      // h={120}
                      ml={2}
                      mb={2}
                      mt={index === 0 || index === 1 ? 2 : 0}
                      shadow={1}
                      bg={'white'}
                      p={3}
                      onPress={() => {
                        bookingTime == '' || addressId == '' || partnerId == '' || selectedId == '' ?
                          navigation.navigate('AddressList', {
                            service: serviceId,
                            subService: subServiceId,
                            childService: item.id,
                          }) :
                          navigation.navigate('ServiceProviderProfile', {
                            selectedId: selectedId,
                            partnerId: partnerId,
                            bookingDate: bookingDate,
                            bookingTime: bookingTime,
                            qty,
                            addressId: addressId,
                            serviceId: serviceId,
                            // subService:subServiceId,
                            childService: item.id,
                          })
                          setInd(null)

                      }}
                    >
                      <Image
                        source={{ uri: SUB_IMG_URL + item.cs_icon }}
                        style={{ alignItems: 'center', height: 50, width: 50 }}
                        resizeMode="cover"
                      />
                      <Text textAlign={'center'} pt={3} fontSize={'xs'}>
                        {lang === 'en'
                          ? item.en_child_category_name
                          : item.ar_child_category_name}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            )}
          </Box>
        </Column>
      </HStack>
    </Box >
  );
};
export const screenOptions = () => ({
  headerTitle: '',
});

export default SubCategoryScreen;
