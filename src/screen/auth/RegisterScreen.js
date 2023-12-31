import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, StatusBar, View, Image, Alert, Text} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {Box, FormControl, Input} from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import {SearchableDropdown} from '../../components/common/SearchableDropdown';
import {Loader} from '../../components/common/Loader';
import {SocialLogin} from '../../components/SocialLogin';

const BACKGROUND_IMAGE = require('../../assets/Color_logo_no_background.png');

const RegisterScreen = ({navigation}) => {
  const {t} = useTranslation('langChange');

  const [referral, setReferral] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [countryId, setCountryId] = useState(0);

  const [loading, setLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const {countries, cities} = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setError(null);
      setLoading(true);
      try {
        await dispatch(authActions.setCountries());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  const getCities = useCallback(
    async val => {
      setError(null);
      setCitiesLoading(true);
      try {
        await dispatch(authActions.setCities(val));
      } catch (e) {
        setError(e.message);
      } finally {
        setCitiesLoading(false);
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  const _onRegister = useCallback(async () => {
    const reg = new RegExp('^[0-9]*$');
    if (!reg.test(mobile)) {
      setError('Mobile Number must be Number');
      return;
    }
    setSubmitLoading(true);
    setError(null);
    try {
      await dispatch(
        authActions.register({
          name,
          email,
          password,
          confirmPassword,
          phoneCode,
          mobile,
          countryCode: countryId,
          cityCode: cityId,
          referral,
        }),
      );
      navigation.navigate('VerifyEmail');
    } catch (e) {
      setError(e.message);
      setSubmitLoading(false);
    }
  }, [
    mobile,
    dispatch,
    name,
    email,
    password,
    confirmPassword,
    phoneCode,
    countryId,
    cityId,
    referral,
    navigation,
  ]);

  useEffect(() => {
    if (countries) {
      setCountryList(countries);
    }
    if (cities) {
      setCityList(cities);
    }
  }, [cities, countries]);

  const onSelectCountry = (id, text) => {
    setCountryId(id);
    setCountry(text);
    getCities(id);
    const item = countryList.find(i => i.id === id);
    if (item) {
      setPhoneCode(item.phonecode);
    }
  };

  const onSelectCity = (id, text) => {
    setCityId(id);
    setCity(text);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{backgroundColor: Colors.white}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.container}>
          <View style={styles.imgContainer}>
            <Image source={BACKGROUND_IMAGE} style={styles.logoImg} />
          </View>
          <Title style={styles.register}>{t('reg')}</Title>
          <View style={styles.form}>
            <FormControl
              w={'95%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{t('fname')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={name}
                onChangeText={setName}
                InputLeftElement={
                  <Ionicons
                    name="person"
                    size={24}
                    color={Colors.primary}
                    style={{marginRight: 8}}
                  />
                }
              />
            </FormControl>
            <FormControl
              w={'95%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{t('email')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={email}
                onChangeText={setEmail}
                InputLeftElement={
                  <Ionicons
                    name="mail"
                    size={24}
                    color={Colors.primary}
                    style={{marginRight: 8}}
                  />
                }
              />
            </FormControl>
            {/*<FormControl*/}
            {/*  w={'95%'}*/}
            {/*  alignSelf={'center'}*/}
            {/*  isInvalid={false}*/}
            {/*  mb={2}>*/}
            {/*  <FormControl.Label>{t('Country')}</FormControl.Label>*/}
            {/*  <Input*/}
            {/*    variant="underlined"*/}
            {/*    size={'lg'}*/}
            {/*    value={country}*/}
            {/*    editable={false}*/}
            {/*    InputLeftElement={*/}
            {/*      <Ionicons*/}
            {/*        name="earth"*/}
            {/*        size={24}*/}
            {/*        color={Colors.primary}*/}
            {/*        style={{marginRight: 8}}*/}
            {/*      />*/}
            {/*    }*/}
            {/*  />*/}
            {/*</FormControl>*/}
            <SearchableDropdown
              dataSource={countryList.map(m => ({
                name: m.name,
                id: m.id,
              }))}
              label={'Country'}
              selectedId={country}
              selectedName={country}
              updateVal={onSelectCountry}
              icon={'earth'}
              placeholder={'Select Country'}
              error={'Please Select Country'}
            />
            <SearchableDropdown
              isLoading={citiesLoading}
              dataSource={cityList.map(m => ({
                name: m.name,
                id: m.id,
              }))}
              label={'City'}
              selectedId={city}
              selectedName={city}
              updateVal={onSelectCity}
              icon={'md-location'}
              placeholder={'Select City'}
              error={'Please Select Country'}
              isDisabled={!country}
            />
            <FormControl
              w={'95%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{t('password')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                InputLeftElement={
                  <Ionicons
                    name="lock-closed-outline"
                    size={24}
                    color={Colors.primary}
                    style={{marginRight: 8}}
                  />
                }
              />
            </FormControl>
            <FormControl
              w={'95%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{t('confPass')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                InputLeftElement={
                  <Ionicons
                    name="lock-closed"
                    size={24}
                    color={Colors.primary}
                    style={{marginRight: 8}}
                  />
                }
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
                <FormControl.Label>Code</FormControl.Label>
                <Input
                  variant="underlined"
                  size={'lg'}
                  value={phoneCode}
                  keyboardType="number-pad"
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
                <FormControl.Label>
                  {i18n.t('langChange:mob')}
                </FormControl.Label>
                <Input
                  variant="underlined"
                  size={'lg'}
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="number-pad"
                />
              </FormControl>
            </Box>
            <FormControl
              w={'95%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{t('referralCode')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={referral}
                onChangeText={setReferral}
                InputLeftElement={
                  <Ionicons
                    name="arrow-redo"
                    size={24}
                    color={Colors.primary}
                    style={{marginRight: 8}}
                  />
                }
              />
            </FormControl>
            {/*<View*/}
            {/*  style={{*/}
            {/*    backgroundColor: Colors.primary,*/}
            {/*    alignItems: 'center',*/}
            {/*    alignSelf: 'center',*/}
            {/*    paddingVertical: RFValue(15),*/}
            {/*    width: '20%',*/}
            {/*    marginVertical: RFValue(30),*/}
            {/*    borderRadius: RFValue(100),*/}
            {/*  }}*/}
            {/*  pointerEvents={loading ? 'none' : null}>*/}
            {/*  <TouchableOpacity*/}
            {/*    onPress={_onRegister}*/}
            {/*    loading={submitLoading}*/}
            {/*    disabled={submitLoading}>*/}
            {/*    <Ionicons name="arrow-forward" size={30} color={Colors.white} />*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}
            <Button
              mode="contained"
              style={styles.btn}
              labelStyle={{paddingVertical: RFValue(2)}}
              contentStyle={{height: 50}}
              onPress={_onRegister}
              loading={submitLoading}
              disabled={submitLoading}>
              Register
            </Button>
          </View>
        </View>
        <Text style={styles.account}>Already have an account</Text>
        <Text
          style={styles.signUp}
          onPress={() => navigation.navigate('Login')}>
          Login
        </Text>
        <SocialLogin />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: RFValue(15),
  },
  input: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('27%'),
    alignSelf: 'center',
    paddingTop: RFValue(15),
    backgroundColor: Colors.primary,
  },
  register: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(10),
  },
  logoImg: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  mobile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  form: {padding: RFValue(15)},
  ///
  itemSeparatorStyle: {
    height: 1,
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#D3D3D3',
  },
  selectLabelTextStyle: {
    color: '#000',
    textAlign: 'left',
    width: '99%',
    padding: RFValue(10),
    flexDirection: 'row',
  },
  placeHolderTextStyle: {
    color: Colors.grey,
    padding: RFValue(10),
    textAlign: 'left',
    width: '99%',
    flexDirection: 'row',
    fontSize: RFValue(14),
  },
  listTextViewStyle: {
    color: '#000',
    marginVertical: RFValue(10),
    flex: 0.9,
    marginLeft: RFValue(20),
    marginHorizontal: RFValue(10),
    textAlign: 'left',
  },
  pickerStyle: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    paddingVertical: RFValue(10),
    width: '90%',
    alignItems: 'center',
  },
  pickerStyleCode: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    width: '75%',
  },
  dropDownImageStyle: {
    width: RFValue(10),
    height: RFValue(10),
    alignSelf: 'center',
  },
  //
  codeContainer: {
    backgroundColor: 'rgba(255,255,255,1)',
    flexDirection: 'row',
    // borderBottomWidth: RFValue(1),
    // borderBottomColor: "#d3d3d3",
    marginLeft: RFValue(10),
    marginRight: RFValue(10),
    flex: 1,
  },
  mobileIcon: {
    alignSelf: 'center',
    marginLeft: RFValue(15),
  },
  number: {
    width: '55%',
    backgroundColor: Colors.white,
    marginRight: RFValue(10),
  },
  dropDownStyles: {
    flexDirection: 'row',
    marginHorizontal: RFValue(10),
    borderBottomWidth: RFValue(1),
    borderBottomColor: '#d3d3d3',
  },
  earth: {
    paddingTop: RFValue(20),
    marginLeft: RFValue(10),
  },
  //
  btn: {
    alignSelf: 'center',
    width: '40%',
    borderRadius: RFValue(50),
    marginVertical: RFValue(30),
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUp: {
    color: Colors.primary,
    alignSelf: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  account: {
    color: Colors.primary,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default RegisterScreen;
