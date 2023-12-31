import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Image, Alert, I18nManager } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Colors from '../../constants/Colors';
import * as userActions from '../../store/actions/user';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const Security = () => {
  const dispatch = useDispatch();
  const { user_id } = useSelector(state => state.auth);
  const { t } = useTranslation('langChange');
  const [old_password, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onClickHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        userActions.updatePassword(
          user_id,
          old_password,
          password,
          password_confirmation,
        ),
      );
      setPassword_confirmation('');
      setOldPassword('');
      setPassword('');
      setError(i18n.t('langChange:alertPassUpdMsg'));
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [dispatch, user_id, old_password, password, password_confirmation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        { text: 'OK', onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <>
          <View style={styles.imgContainer}>
            <Image
              source={require('../../assets/Color_logo_no_background.png')}
              style={styles.logoImg}
            />
          </View>
          <Title style={styles.title}>{t('changePass')}</Title>
          <View style={styles.form}>
            <TextInput
              left={
                <TextInput.Icon name="lock-outline" color={Colors.primary} />
              }
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={t('oldPass')}
              secureTextEntry
              style={styles.input}
              value={old_password}
              onChangeText={setOldPassword}
            />
            <TextInput
              left={
                <TextInput.Icon name="lock-outline" color={Colors.primary} />
              }
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={t('newPass')}
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              left={<TextInput.Icon name="lock" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={t('confPass')}
              secureTextEntry
              style={styles.input}
              value={password_confirmation}
              onChangeText={setPassword_confirmation}
            />
            <Button
              mode="contained"
              style={styles.btn}
              labelStyle={{ paddingVertical: RFValue(2) }}
              contentStyle={{ height: 50 }}
              onPress={onClickHandler}
              loading={loading}
              disabled={loading}>
              {t('updBtn')}
            </Button>
          </View>
        </>
      </KeyboardAwareScrollView>
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
  imgContainer: {
    width: wp('100%'),
    height: hp('15%'),
    paddingTop: RFValue(15),
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
  btn: {
    width: '100%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  form: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(15),
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default Security;
