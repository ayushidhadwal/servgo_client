import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  Pressable,
  Share,
  Alert,
  Platform,
  ActivityIndicator,
  I18nManager,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Divider} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import {useTranslation} from 'react-i18next';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import * as userActions from '../../store/actions/user';
import {LANG_TOKEN, setAppLanguage} from '../../store/actions/lang';
import {androidPackageName} from '../../constants/common';
import {useError} from '../../hooks/useError';

const ProfileRow = ({onPress, title, icon, isDelete}) => (
  <>
    <Pressable style={styles.rowStyle} onPress={onPress}>
      <Ionicons
        name={Platform.OS === 'ios' ? `ios-${icon}` : `md-${icon}`}
        size={22}
        color={isDelete ? 'red' : Colors.grey}
        style={styles.icon}
      />
      <Text style={[styles.rowText, {color: isDelete ? 'red' : null}]}>
        {title}
      </Text>
    </Pressable>
    <Divider />
  </>
);

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const {lang} = useSelector(state => state.lang);
  const {Profile} = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const setError = useError();
  const {t} = useTranslation('langChange');

  const logoutHandler = async () => {
    setError(null);
    try {
      await dispatch(authActions.logout());
    } catch (e) {
      setError(e.message);
    }
  };

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

  const _onShare = useCallback(async () => {
    try {
      await Share.share({
        message: `https://play.google.com/store/apps/details?id=${androidPackageName}`,
      });
    } catch (e) {
      setError(e.message);
    }
  }, [setError]);

  const deleteAccHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await dispatch(userActions.deleteUserAccount());
    } catch (e) {
      setError(e.message);
    }
    setIsLoading(false);
  }, [dispatch, setError]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary} />
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <ScrollView style={{backgroundColor: Colors.white}}>
          {/* Profile Info Card Start~ */}
          <View style={styles.containerRow1}>
            <View>
              <Text style={styles.verify}>{t('verifyCust')}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text>{Profile.phone_code} </Text>
                <Text>{Profile.mobile}</Text>
              </View>
            </View>
            <Ionicons
              name="ios-create"
              size={RFValue(24)}
              color={Colors.grey}
              style={{paddingTop: RFValue(10)}}
              onPress={() => navigation.navigate('EditProfile')}
            />
          </View>
          {/* Profile Info Card End~ */}

          <View style={{marginBottom: 14}}>
            <ProfileRow
              onPress={() => navigation.navigate('EditProfile')}
              title={t('mangProfile')}
              icon="person"
            />
            <ProfileRow
              onPress={() => navigation.navigate('UpdateEmail')}
              title={t('updateEmail')}
              icon="mail"
            />
            <ProfileRow
              onPress={() => navigation.navigate('UpdateMobile')}
              title={t('updateMobile')}
              icon="call"
            />
            <ProfileRow
              onPress={() => navigation.navigate('AddressBook')}
              title={t('addressBook')}
              icon="location-sharp"
            />
            <ProfileRow
              onPress={() => navigation.navigate('Wallet')}
              title={t('myWallet')}
              icon="wallet"
            />
            <ProfileRow
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
              }}
              title={t('changeLanguage')}
              icon="language"
            />
            <ProfileRow
              onPress={() => navigation.navigate('Password')}
              title={t('security')}
              icon="shield-checkmark"
            />
            <ProfileRow
              onPress={() => navigation.navigate('about')}
              title={t('aboutUs')}
              icon="information-circle"
            />
            <ProfileRow
              onPress={_onShare}
              title={t('shareServGo')}
              icon="share"
            />
            <ProfileRow
              onPress={() => navigation.navigate('help')}
              title={t('help')}
              icon="help-buoy"
            />
            <ProfileRow
              onPress={() => navigation.navigate('ServiceList')}
              title={t('raise')}
              icon="alert-circle"
            />
            <ProfileRow
              onPress={() => navigation.navigate('Review')}
              title={t('rateUs')}
              icon="star"
            />
            <ProfileRow
              isDelete
              onPress={() =>
                Alert.alert(
                  'Please confirm',
                  'Are you sure you want to delete your account, this action is not reversible all data will be lost.',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => {},
                    },
                    {
                      text: 'Yes, Delete my account',
                      onPress: deleteAccHandler,
                      style: 'destructive',
                    },
                  ],
                )
              }
              title={t('deleteAccount')}
              icon="trash-bin"
            />
          </View>

          {/* Logout Button  start*/}
          <Button mode="outlined" style={styles.btn} onPress={logoutHandler}>
            {t('logout')}
          </Button>
          {/* Logout Button End~ */}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
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
  containerRow1: {
    backgroundColor: 'rgba(33, 109, 158, 0.3)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(12),
  },
  rowStyle: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(12),
    alignItems: 'center',
  },
  rowText: {
    fontSize: RFValue(13),
  },
  icon: {
    paddingRight: RFValue(15),
  },
  btn: {
    width: '60%',
    alignSelf: 'center',
    marginVertical: RFValue(15),
  },
  verify: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  dangerous: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    paddingHorizontal: RFValue(10),
  },
  box: {paddingBottom: RFValue(12)},
  msg: {
    fontSize: 12,
    color: 'grey',
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(2),
  },
});

export default ProfileScreen;
