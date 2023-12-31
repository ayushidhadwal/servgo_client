import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, StatusBar, View, Image, I18nManager } from 'react-native';
import { TextInput, Title, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import { useTranslation } from 'react-i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const ResetPassScreen = props => {
  const { token } = useSelector(state => state.auth);
  const { t } = useTranslation('langChange');

  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(authActions.set_new_password({ token, password, password_confirmation }));
      setLoading(false);
      // alert('Password reset successfully')
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset successfully'
      })
      props.navigation.navigate('Login');
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, [dispatch, password, password_confirmation, props.navigation, token]);

  useEffect(() => {
    if (error) {
      alert(error.toString());
      setError(null);
    }
  }, [error]);

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{ backgroundColor: Colors.white }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.imgContainer}>
          <Image
            source={require('../../assets/Color_logo_no_background.png')}
            style={styles.img}
          />
        </View>
        <Title style={styles.title}>{t('resetPassword')}</Title>
        <View style={styles.form}>
          <TextInput
            left={<TextInput.Icon name="lock-outline" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={t('newPassword')}
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <TextInput
            left={<TextInput.Icon name="lock-reset" color={Colors.primary} />}
            mode={I18nManager.isRTL ? 'outlined' : 'flat'}
            label={t('confirmPassword')}
            style={styles.input}
            secureTextEntry
            value={password_confirmation}
            onChangeText={text => setPassword_confirmation(text)}
          />
          <Button
            mode="contained"
            style={styles.btn}
            labelStyle={{ paddingVertical: RFValue(2) }}
            contentStyle={{ height: 50 }}
            onPress={onSubmitHandler}
            disabled={loading}
            loading={loading}>
            {t('submitBtn')}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  imgContainer: {
    width: wp('100%'),
    height: hp('20%'),
    alignSelf: 'center',
    paddingTop: RFValue(15),
    backgroundColor: Colors.primary,
  },
  img: {
    width: '90%',
    height: '100%',
    resizeMode: 'contain',
  },
  title: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: RFValue(22),
    textTransform: 'uppercase',
    paddingTop: RFValue(30),
  },
  btn: {
    width: '70%',
    height: 50,
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  form: {
    padding: RFValue(15),
  },
  input: { backgroundColor: Colors.white },
});

export default ResetPassScreen;
