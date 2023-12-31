import 'react-native-reanimated';
import React from 'react';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

import App from './App';
import {name as appName} from './app.json';
import {onMessageReceived} from './src/lib/notifee';

messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(onMessageReceived);

notifee.onBackgroundEvent(async () => {});
notifee.onForegroundEvent(async () => {});

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    return null;
  }

  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
