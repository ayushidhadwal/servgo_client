import * as React from 'react';
import {View, I18nManager, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import i18n from 'i18next';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Text} from 'native-base';
import {useTranslation} from 'react-i18next';
import {useCallback, useState} from 'react';

import Colors from '../../constants/Colors';
import {useError} from '../../hooks/useError';
import * as userActions from '../../store/actions/user';
import {useInterval} from '../../hooks/useInterval';

const UpdateEmailScreen = ({navigation}) => {
  const {t} = useTranslation('langChange');

  const [timer, setTimer] = useState(120);
  const [email, setEmail] = useState('');
  const [OTP, setOTP] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [DisableEmail, SetDisableEmail] = useState(false);
  const dispatch = useDispatch();
  const setError = useError();

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

  const onClickHandler = useCallback(async () => {
    setloading(true);
    setError(null);
    try {
      await dispatch(userActions.updateUserEmail(email, OTP));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Email Updated successfully',
      });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }
    setloading(false);
  }, [OTP, dispatch, email, navigation, setError]);

  const sendOTP = useCallback(async () => {
    setloading(true);
    setError(null);
    try {
      await dispatch(userActions.sendOTPEmail(email));
      setTimer(120);
      setShow(true);
      SetDisableEmail(true);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'OTP sent successfully',
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message,
      });
    }
    setloading(false);
  }, [dispatch, email, setError]);

  return (
    <View style={styles.screen}>
      <TextInput
        disabled={DisableEmail}
        left={<TextInput.Icon name="email" color={Colors.primary} />}
        mode={I18nManager.isRTL ? 'outlined' : 'flat'}
        label={i18n.t('langChange:email')}
        style={styles.input1}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      {show && (
        <>
          <TextInput
            left={
              <TextInput.Icon
                name="message-processing-outline"
                color={Colors.primary}
              />
            }
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={i18n.t('langChange:otp')}
            style={styles.input1}
            value={OTP}
            keyboardType={'numeric'}
            maxLength={6}
            onChangeText={text => setOTP(text)}
          />
          <Text
            alignSelf={'center'}
            style={{marginTop: RFValue(20), fontWeight: 'bold'}}>
            {t('receive')}{' '}
            {timer === 0 ? (
              <Text onPress={sendOTP} style={{color: Colors.primary}}>
                {t('resendOtp')}
              </Text>
            ) : (
              <Text style={{color: Colors.primary}}>
                {t('otpResend')} {timer}
              </Text>
            )}
          </Text>
        </>
      )}
      <Button
        mode="contained"
        style={styles.btnStyles}
        onPress={() => {
          show ? onClickHandler() : sendOTP();
        }}
        loading={loading}
        disabled={loading}>
        {i18n.t('langChange:updBtn')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  input1: {
    width: '93%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  btnStyles: {
    width: '60%',
    marginVertical: RFValue(30),
    alignSelf: 'center',
  },
});

export default UpdateEmailScreen;
