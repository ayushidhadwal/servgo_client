import React from 'react';
import { StyleSheet, Text, Image, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
// import app from '../../app.json';

import Colors from '../../constants/Colors';

const SERV_GO_IMG = require('../../assets/logo.jpg');

const AboutUs = () => {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <Text>
        ServGo is a platform that connects customers with service providers. And
        acts as such by creating, hosting, maintaining and providing our ServGo
        services to you via the internet through website and mobile
        applications. Our services allow you to request any service from any
        service provider with a ServGo account, and, where available, to receive
        rewards. Our service availability varies by country or region. You can
        see what services are available in your country/region by logging into
        your ServGo account.
      </Text>
      <Text>ServGo services are offered by ServGo FZ-LLC.</Text>
      <Image source={SERV_GO_IMG} style={styles.logo} />
      {/*<Text style={styles.version}>{app.expo.version}</Text>*/}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(15),
  },
  logo: {
    width: RFValue(100),
    height: RFValue(50),
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  version: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AboutUs;
