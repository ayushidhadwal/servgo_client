import React, {useState, useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Image, Text, Alert, I18nManager} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';
import RNRestart from 'react-native-restart';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import {LANG_TOKEN, setAppLanguage} from '../store/actions/lang';
import {useError} from '../hooks/useError';
import {SocialLogin} from './SocialLogin';

const LoginForm = ({navigation}) => {
  const {lang} = useSelector(state => state.lang);

  const {t} = useTranslation('langChange');

  const setError = useError();

  const [email, setEmail] = useState(
    __DEV__ ? 'mohanad.al.akal@hotmail.com' : '',
  );
  const [password, setPassword] = useState(__DEV__ ? '123456' + '' : '');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const {
    register: {isVerified, mobileNumber},
  } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isVerified && mobileNumber) {
      navigation.navigate('VerifyEmail');
    }
  }, [isVerified, navigation, mobileNumber]);

  const loginHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.login(email, password));
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [dispatch, email, password, setError]);

  return (
    <View style={styles.screen}>
      <View style={styles.imgContainer}>
        <Image
          source={require('../assets/Color_logo_no_background.png')}
          style={styles.logoImg}
        />
      </View>
      <Title style={styles.title}>{t('title')}</Title>
      <View style={{paddingHorizontal: RFValue(15)}}>
        <TextInput
          left={<TextInput.Icon name="email" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={t('email')}
          style={{backgroundColor: Colors.white}}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={t('password')}
          secureTextEntry
          style={{backgroundColor: Colors.white}}
          value={password}
          onChangeText={setPassword}
        />
        <Text
          style={styles.forgot}
          onPress={() => navigation.navigate('Forgot')}>
          {t('forgot')}
        </Text>
        <Button
          mode="contained"
          style={styles.btn}
          labelStyle={{paddingVertical: RFValue(2)}}
          contentStyle={{height: 50}}
          onPress={loginHandler}
          loading={loading}
          disabled={loading}>
          {t('btn')}
        </Button>

        <Text
          style={styles.lang}
          onPress={() => {
            Alert.alert(
              t('changeLanguage'),
              '',
              [
                {
                  text: t('english'),
                  onPress: async () => {
                    if (lang === 'en') {
                      return null;
                    }
                    dispatch(setAppLanguage('en'));
                    await i18n.changeLanguage('en');
                    await AsyncStorage.setItem(LANG_TOKEN, 'en');
                    I18nManager.forceRTL(false);
                    RNRestart.Restart();
                  },
                },
                {
                  text: t('arabic'),
                  onPress: async () => {
                    if (lang === 'ar') {
                      return null;
                    }
                    dispatch(setAppLanguage('ar'));
                    await i18n.changeLanguage('ar');
                    await AsyncStorage.setItem(LANG_TOKEN, 'ar');
                    I18nManager.forceRTL(true);
                    RNRestart.Restart();
                  },
                },
              ],
              {cancelable: false},
            );
          }}>
          {t('changeLanguage')}
        </Text>
        <Text style={styles.account}>{t('dont')}</Text>
        <Text
          style={styles.signUp}
          onPress={() => navigation.navigate('Register')}>
          {t('signUp')}
        </Text>
        <SocialLogin />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heading: {
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: RFValue(15),
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('32%'),
    paddingTop: RFValue(50),
    backgroundColor: Colors.primary,
    paddingBottom: RFValue(20),
  },
  logoImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(10),
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(40),
  },
  btn: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(20),
  },
  forgot: {
    color: Colors.primary,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingVertical: RFValue(10),
  },
  lang: {
    color: Colors.primary,
    marginVertical: RFValue(30),
    alignSelf: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
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

export default LoginForm;
