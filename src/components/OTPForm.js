import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, View, Text, I18nManager } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import Colors from '../constants/Colors';

import * as authActions from '../store/actions/auth';
import { useTranslation } from 'react-i18next';
import { useInterval } from '../hooks/useInterval';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const OTPForm = props => {
  const [timer, setTimer] = useState(120);
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
  const { email, otp } = useSelector(state => state.auth);
  const { t } = useTranslation('langChange');

  const [userOTP, setUserOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOTPLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const otpSendAgain = useCallback(async () => {
    setTimer(120);
    setError(null);
    try {
      await dispatch(authActions.forgotPassword({ email }));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP sent successfully'
      })
    } catch (e) {
      setError(e.message);
      setOTPLoading(false);
    }
    setOTPLoading(false);
  }, [dispatch, email]);

  const onNextHandler = useCallback(async () => {
    if (parseInt(otp) !== parseInt(userOTP)) {
      alert('Wrong OTP');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.verifyOtp({ email, userOTP }));
      props.navigation.navigate('ResetPass');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  }, [dispatch, email, otp, props.navigation, userOTP]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);
  return (
    <View style={styles.screen}>
      <View
        style={{
          marginTop: RFValue(50),
          alignItems: 'center',
        }}>
        <Text style={styles.heading}>{t('enterVerificationCode')}</Text>
        <Text style={styles.heading2}>{t('otpMsg')}</Text>
        <Text style={styles.heading3}>{email}</Text>
      </View>
      <View style={styles.OTPcontainer}>
        <TextInput
          left={<TextInput.Icon name="lock" color={Colors.primary} />}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label="Enter OTP"
          style={styles.input}
          value={userOTP}
          onChangeText={text => setUserOTP(text)}
          maxLength={6}
          keyboardType="number-pad"
        />
        <Text style={{ marginTop: RFValue(10), fontWeight: 'bold' }}>
          {t('receive')}{' '}
          {/* <Text onPress={otpSendAgain} style={{color: Colors.primary}}>
            {t('sendAgain')}
          </Text> */}
          {timer === 0 ? (
            <Text onPress={otpSendAgain} style={{ color: Colors.primary }}>
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
        onPress={onNextHandler}
        disabled={loading}
        loading={loading}>
        {t('verifyBtn')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
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

export default OTPForm;
