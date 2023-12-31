import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import i18n from 'i18next';

import LoginScreen from '../screen/auth/LoginScreen';
import OTPScreen from '../screen/auth/OTPScreen';
import RegisterScreen from '../screen/auth/RegisterScreen';
import ForgotPassScreen from '../screen/auth/ForgotPassScreen';
import ResetPassScreen from '../screen/auth/ResetPassScreen';
import VerifyEmailScreen from '../screen/auth/VerifyEmailScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
        options={{
          title: i18n.t('langChange:OTPVerification'),
        }}
      />
      <Stack.Screen
        name="VerifyEmail"
        component={VerifyEmailScreen}
        options={{
          title: 'Account Verification',
        }}
      />
      <Stack.Screen name="Forgot" component={ForgotPassScreen} />
      <Stack.Screen name="ResetPass" component={ResetPassScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
