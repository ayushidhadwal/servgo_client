import React, { useCallback, useState } from 'react';
import { StyleSheet, StatusBar, View, Text, I18nManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch, useSelector } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import { useError } from '../../hooks/useError';
import { useInterval } from '../../hooks/useInterval';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const VerifyEmailScreen = () => {
  const { t } = useTranslation('langChange');

  const setError = useError();
  const dispatch = useDispatch();
  const {
    register: { mobileNumber },
  } = useSelector(state => state.auth);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(10);

  useInterval(() => {
    setTimer(prevState => {
      const time = prevState;
      if (time > 0) {
        return time - 1;
      } else {
        return 0;
      }
    });
  }, 1000);

  const _resendOTP = useCallback(async () => {
    setTimer(10);
    setError(null);
    try {
      await dispatch(authActions.resendRegistrationMobileOtp(mobileNumber));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP sent successfully'
      })
    } catch (e) {
      setError(e.message);
    }
  }, [dispatch, mobileNumber, setError]);

  const _verifyHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.verifyUserMobile(mobileNumber, otp));
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [dispatch, mobileNumber, otp, setError]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
        <View style={styles.container}>
          <View
            style={{
              marginTop: RFValue(50),
              alignItems: 'center',
            }}>
            <Text style={styles.heading}>{t('mobVerify')}</Text>
            <Text style={styles.heading2}>{t('otpMsg')}</Text>
            <Text style={styles.heading3}>{mobileNumber}</Text>
          </View>
          <View style={styles.OTPcontainer}>
            <TextInput
              left={<TextInput.Icon name="lock" color={Colors.primary} />}
              mode={I18nManager.isRTL ? 'outlined' : 'flat'}
              label={t('otp')}
              style={styles.input}
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              keyboardType="number-pad"
            />
            <Text style={{ marginTop: RFValue(10), fontWeight: 'bold' }}>
              {t('otpErrMsg')}{' '}
              {timer === 0 ? (
                <Text onPress={_resendOTP} style={{ color: Colors.primary }}>
                  {t('resendOtp')}
                </Text>
              ) : (
                <Text style={{ color: Colors.primary }}>
                  {t('otpResend')} {timer}
                </Text>
              )}
            </Text>
          </View>
          <Button
            mode="contained"
            style={styles.btn}
            contentStyle={{ paddingVertical: RFValue(10) }}
            onPress={_verifyHandler}
            disabled={loading}
            loading={loading}>
            {t('verifyBtn')}
          </Button>
        </View>
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
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(50),
  },
  heading: {
    fontSize: RFValue(19),
    color: Colors.black,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: RFValue(25),
  },
  heading2: {
    fontSize: RFValue(14),
    color: Colors.grey,
    marginVertical: RFValue(8),
    textAlign: 'center',
  },
  heading3: {
    fontSize: RFValue(14),
    color: Colors.black,
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  btn: {
    width: '80%',
    alignSelf: 'center',
    marginTop: RFValue(30),
  },
  OTPcontainer: {
    // justifyContent: "center",
    // alignItems: "center",
    marginVertical: RFValue(25),
  },
  roundedTextInput: {
    borderWidth: RFValue(4),
  },
  timer: {
    color: Colors.grey,
    textAlign: 'center',
    fontSize: RFValue(15),
  },
  input: {
    backgroundColor: Colors.white,
  },
});

export default VerifyEmailScreen;
