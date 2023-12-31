import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {I18nManager, StyleSheet} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import i18n from 'i18next';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import {useError} from '../../hooks/useError';
import * as userActions from '../../store/actions/user';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useInterval} from '../../hooks/useInterval';
import {Box, Text, View} from 'native-base';
import {SearchableDropdown} from '../../components/common/SearchableDropdown';
import * as authActions from '../../store/actions/auth';
import {Loader} from '../../components/common/Loader';

const UpdateMobileScreen = ({navigation}) => {
  const [mobile, setMobile] = useState('');
  
  const [OTP, setOTP] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [btnloading, setbtnloading] = useState(false);
  const [DisableNumber, SetDisableNumber] = useState(false);
  const [timer, setTimer] = useState(120);
  const {t} = useTranslation('langChange');
  const dispatch = useDispatch();
  const setError = useError();
  const {countries} = useSelector(state => state.auth);

  const {Profile} = useSelector(state=>state.user)

  const [phoneCode, setphoneCode] = useState(Profile.phone_code);
  
  const setCountries = useCallback(async () => {
    setError(null);
    setloading(true);
    try {
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    } finally {
      setloading(false);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    setCountries();
  }, [setCountries]);

  const onSelectPhonecode = id => {
    setphoneCode(id);
  };

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
    setbtnloading(true);
    setError(null);
    try {
      await dispatch(userActions.updateUserMobile(mobile, OTP, phoneCode));
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Number updated successfully',
      });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }
    setbtnloading(false);
  }, [OTP, dispatch, mobile, setError]);

  const sendOTP = useCallback(async () => {
    setbtnloading(true);
    setError(null);
    try {
      await dispatch(userActions.sendOTPMobile(mobile, phoneCode));
      setTimer(120);
      setShow(true);
      SetDisableNumber(true);
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
    setbtnloading(false);
  }, [dispatch, mobile, setError]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <Box flexDirection={'row'} justifyContent="space-around">
        <View width={'25%'}>
          <SearchableDropdown
            isDisabled={DisableNumber}
            dataSource={countries.map(m => ({
              name: m.phonecode,
              id: m.phonecode,
            }))}
            selectedId={phoneCode}
            selectedName={phoneCode}
            updateVal={onSelectPhonecode}
            label={t('code')}
          />
        </View>

        <TextInput
          disabled={DisableNumber}
          mode={I18nManager.isRTL ? 'outlined' : 'flat'}
          label={i18n.t('langChange:mob')}
          style={styles.input1}
          value={mobile}
          onChangeText={text => setMobile(text)}
          keyboardType={'numeric'}
        />
      </Box>

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
            style={styles.input2}
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
        loading={btnloading}
        disabled={btnloading}>
        {i18n.t('langChange:updBtn')}
      </Button>
    </View>
  );
};

export default UpdateMobileScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.white,
  },
  input1: {
    width: '73%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  input2: {
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
