import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import RootStack from './RootStack';
import AuthStack from './AuthStack';
import {NotAvailable} from '../components/modals/NotAvailable';
import {useUserSession} from '../hooks/auth/useUserSession';

const AppNavigator = () => {
  const {isAvailable, isLoading} = useUserSession();

  const {auth} = useSelector(state => state.auth);
  const isLoggedIn = auth.userId && auth.accessToken && auth.tokenType;

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <>
        <NotAvailable isNoAvailable={!isAvailable} />
        {isLoggedIn ? <RootStack /> : <AuthStack />}
      </>
    </NavigationContainer>
  );
};

export default AppNavigator;
