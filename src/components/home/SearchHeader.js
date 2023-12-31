import React, {useEffect, useState} from 'react';
import {Box, Pressable, Text} from 'native-base';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../constants/Colors';
import {useGetAddressList} from '../../hooks/address/useAddress';

export const SearchHeader = ({onLocationPress}) => {
  const {t} = useTranslation('langChange');
  const [addresses, loading] = useGetAddressList();

  const [locate, setLocate] = useState('');

  useEffect(() => {
    const add = addresses.find(m => m.isDefault === true);
    if (add) {
      setLocate({...add});
    }
  }, [addresses]);

  return (
    <>
      <Box backgroundColor={'rgba(33, 109, 158, 0.3)'} p={2}>
        <Pressable onPress={onLocationPress}>
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
      </Box>
      <Text
        textAlign={'left'}
        color={Colors.primary}
        fontWeight={'bold'}
        fontSize={'lg'}
        ml={15}
        mb={2}
        mt={3}>
          {t('allServices')}
      </Text>
    </>
  );
};
