import {GestureHandlerRootView} from 'react-native-gesture-handler';
import * as React from 'react';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NativeBaseProvider} from 'native-base';
import {Provider} from 'react-redux';
import Toast from 'react-native-toast-message';
import {StripeProvider} from '@stripe/stripe-react-native';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

import AppNavigator from './src/navigation/AppNavigator';
import {NativeBaseTheme} from './src/styles/NativeBaseTheme';
import './src/i18n';
import './src/config/axios.config';
import {store} from './src/store';
import Colors from './src/constants/Colors';
import {PUBLISHING_KEY} from './src/constants/common';

dayjs.extend(customParseFormat);

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
  },
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <NativeBaseProvider theme={NativeBaseTheme}>
            <PaperProvider theme={theme}>
              <StripeProvider
                publishableKey={PUBLISHING_KEY}
                merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}"
                urlScheme="com.servgo.app">
                <AppNavigator />
              </StripeProvider>
              <Toast position="bottom" />
            </PaperProvider>
          </NativeBaseProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
