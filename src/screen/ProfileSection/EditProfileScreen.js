import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ActivityIndicator, Platform, View, StyleSheet} from 'react-native';
import {IconButton, FormControl, Input, Box, Text} from 'native-base';
import {Button} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user';
import * as authActions from '../../store/actions/auth';
import {URL} from '../../constants/base_url';
import {SearchableDropdown} from '../../components/common/SearchableDropdown';
import {useError} from '../../hooks/useError';
import {Loader} from '../../components/common/Loader';
import {Image} from '../../components/Image';
import {errorMessage, successMessage} from '../../utils/message';

const EditProfileScreen = ({navigation}) => {
  const {t} = useTranslation('langChange');

  const [loading, setLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [countryName, setCountryName] = useState('');

  const [btnloading, setbtnloading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const {countries, cities} = useSelector(state => state.auth);
  const {Profile} = useSelector(state => state.user);

  useEffect(() => {
    setName(Profile.name);
    setCity(Profile.city);
    setEmail(Profile.email);
    setCountry(Profile.country);
    setCountryName(Profile.country_name);
    setCityName(Profile.city_name);
    setPhoneCode(Profile.phone_code);
    setPhoneNumber(Profile.mobile);
    setImage({
      uri: URL + Profile.photo,
    });
  }, [Profile]);

  const setCountries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch, setError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setCountries);
    return unsubscribe;
  }, [navigation, setCountries]);

  const setCities = useCallback(
    async countryId => {
      setCityLoading(true);
      setError(null);
      try {
        await dispatch(authActions.setCities(countryId));
      } catch (e) {
        setError(e.message);
      }
      setCityLoading(false);
    },
    [dispatch, setError],
  );

  useEffect(() => {
    if (country !== '') {
      setCities(country).then(() => null);
    }
  }, [country, setCities]);

  const choosePhotoFromLibrary = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _openImagePicker();
            break;
          case RESULTS.UNAVAILABLE:
            setError('This feature is not available on this device!');
            break;
          case RESULTS.DENIED:
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                _openImagePicker();
              }
            });
            break;
          case RESULTS.LIMITED:
            _openImagePicker();
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(settingsErr =>
              setError('Unable to open settings!'),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _openImagePicker = async () => {
    try {
      setImgLoading(true);

      const result = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
        quality: 0.5,
      });

      if ('assets' in result) {
        const [file] = result.assets;

        await dispatch(userActions.updatePicture(file));

        setImage({uri: file.uri});
        successMessage('success', 'Profile image update!');
      }
    } catch (e) {
      errorMessage(e.message);
    } finally {
      setImgLoading(false);
    }
  };

  const _onSubmitHandler = useCallback(async () => {
    setError(null);
    setbtnloading(true);

    try {
      await dispatch(
        userActions.updateProfile(
          name,
          email,
          country,
          city,
          phoneNumber,
          phoneCode,
        ),
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: t('alertProfileMsg'),
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setbtnloading(false);
    }
  }, [
    setError,
    dispatch,
    name,
    email,
    country,
    city,
    phoneNumber,
    phoneCode,
    t,
  ]);

  const onSelectCountry = (id, text) => {
    setCountry(id);
    setCountryName(text);
    const a = countries.find(m => m.id === id);
    if (a) {
      setPhoneCode(a.phonecode);
    }
    setCity('');
    setCityName('');
  };

  const onSelectCity = (id, text) => {
    setCity(id);
    setCityName(text);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={{flex: 1}}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{
          flex: 1,
          paddingVertical: RFValue(15),
          backgroundColor: Colors.white,
        }}>
        <Box px={15}>
          <Box
            w={150}
            h={150}
            alignSelf={'center'}
            bg={'white'}
            borderRadius={'full'}>
            {imgLoading ? (
              <Loader />
            ) : (
              <Image
                source={image}
                resizeMode="cover"
                style={{width: '100%', height: '100%', borderRadius: 200}}
                zoom={true}
              />
            )}

            <IconButton
              colorScheme="primary"
              variant={'solid'}
              borderRadius={'full'}
              _icon={{
                as: MaterialIcons,
                name: 'edit',
                color: 'white',
                size: 'md',
              }}
              position={'absolute'}
              bottom={2}
              right={2}
              shadow={5}
              size={'lg'}
              onPress={choosePhotoFromLibrary}
            />
          </Box>

          <FormControl w={'93%'} alignSelf={'center'} isInvalid={false} mb={2}>
            <FormControl.Label>{t('name')}</FormControl.Label>
            <Input
              variant="underlined"
              size={'lg'}
              value={name}
              onChangeText={setName}
            />
          </FormControl>
          <FormControl w={'93%'} alignSelf={'center'} isInvalid={false} mb={2}>
            <FormControl.Label>{t('email')}</FormControl.Label>
            <Input
              variant="underlined"
              size={'lg'}
              value={email}
              onChangeText={setEmail}
              editable={false}
            />
          </FormControl>
          <Box
            alignItems={'center'}
            alignSelf={'center'}
            w={'93%'}
            flexDirection={'row'}
            justifyContent={'space-between'}>
            <FormControl
              w={'30%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{t('code')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={phoneCode}
                keyboardType="number-pad"
                onChangeText={setPhoneCode}
                editable={false}
                InputLeftElement={
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color={Colors.primary}
                    style={{marginRight: 8}}
                  />
                }
              />
            </FormControl>
            <FormControl
              w={'65%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{i18n.t('langChange:mob')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={phoneNumber}
                keyboardType="number-pad"
                onChangeText={setPhoneNumber}
                editable={false}
              />
            </FormControl>
          </Box>
          <SearchableDropdown
            dataSource={countries.map(m => ({
              name: m.name,
              id: m.id,
            }))}
            selectedId={country}
            selectedName={countryName}
            updateVal={onSelectCountry}
            label={t('country')}
            error={'Please Select Country'}
            icon={'earth'}
          />
          {cityLoading ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}>
              <ActivityIndicator size={'small'} color={Colors.primary} />
              <Text>Loading...</Text>
            </View>
          ) : (
            <SearchableDropdown
              dataSource={cities.map(m => ({
                name: m.name,
                id: m.id,
              }))}
              selectedId={city}
              selectedName={cityName}
              updateVal={onSelectCity}
              label={t('city')}
              error={'Please Select Country'}
              icon={'md-location'}
              placeholder={'Search City'}
            />
          )}
          <Button
            mode="contained"
            onPress={_onSubmitHandler}
            loading={btnloading}
            style={styles.btnStyles}
            disabled={btnloading}>
            {t('updProfileBtn')}
          </Button>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btnStyles: {
    width: '90%',
    marginVertical: RFValue(45),
    alignSelf: 'center',
  },
});

export default EditProfileScreen;
