import React from 'react';
import { useSelector } from 'react-redux';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Share,
  Linking,
} from 'react-native';
import { Divider, Headline } from 'react-native-paper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { RFValue } from 'react-native-responsive-fontsize';

import Colors from '../../constants/Colors';
import I18n from '../../i18n';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const RewardScreen = props => {
  const { Profile } = useSelector(state => state.user);

  let sharingUrl = 'https://play.google.com/store';
  let whatsappNo = '';
  let whatsappMsg =
    sharingUrl + '. Here this is your referral code: ' + Profile.referral_code;

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'dfhgdhtft' +
          '. Here this is your referral code: ' +
          Profile.referral_code,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const {t} = useTranslation('langChange');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView style={{ backgroundColor: Colors.white }}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={Colors.primary}
        />
        <View style={styles.containerRow}>
          <View style={styles.containerRow1}>
            <View style={{ flex: 1 }}>
              <Headline style={{ fontWeight: 'bold' }}>
                {i18n.t('langChange:referToWin')} {i18n.t('langChange:aed')} 40
              </Headline>
              <Text>
                {/* You get up to AED 40 for each referral, after they share their
                first purchase. */}
                {i18n.t('langChange:referToWinMsg')}
              </Text>
            </View>
            <Image
              source={require('../../assets/gift.png')}
              style={styles.gift}
            />
          </View>
          <Divider />
          <Text style={styles.ref}>{i18n.t('langChange:referVia')}</Text>
          <View style={styles.iconRow}>
            <FontAwesome
              name="whatsapp"
              size={25}
              color="#4acc64"
              style={styles.iconStyle}
              // onPress={onShare}
              onPress={() =>
                Linking.openURL(
                  `whatsapp://send?phone=${whatsappNo}&text=${whatsappMsg}`,
                )
              }
            />
            <FontAwesome5
              name="facebook-messenger"
              size={24}
              color="#0167f7"
              style={styles.iconStyle}
              onPress={() =>
                Linking.openURL(`fb-messenger://share?link=${sharingUrl}`)
              }
            />
            <Fontisto
              name="link"
              size={24}
              color={Colors.primary}
              style={styles.iconStyle}
              onPress={onShare}
            />
          </View>
          <View style={styles.iconName}>
            <Text>{i18n.t('langChange:whatsapp')}</Text>
            <Text>{i18n.t('langChange:messanger')}</Text>
            <Text>{i18n.t('langChange:copyLink')}</Text>
          </View>
        </View>
        <View style={styles.containerStyle1}>
          <Headline style={styles.heading2}>
            {i18n.t('langChange:howItWork')}
          </Headline>
          <View style={styles.row1}>
            <Image
              source={require('../../assets/reward-1.png')}
              style={styles.img1}
            />
            <Text style={styles.text1}>
              {/* Invite your friends to ServGo to get AED 10 in your wallet (non
              registered friends). */}
              {i18n.t('langChange:howPt1')}
            </Text>
          </View>
          <View style={styles.row1}>
            <Image
              source={require('../../assets/reward-2.png')}
              style={styles.img2}
            />
            <Text style={styles.text2}>
              {i18n.t('langChange:howPt2')}{' '}
              <Text
                style={{ color: Colors.primary }}
                onPress={() => props.navigation.navigate('Register')}>
                {i18n.t('langChange:signUp')}
              </Text>
              .
            </Text>
          </View>
          <View style={styles.row1}>
            <Image
              source={require('../../assets/reward-3.jpeg')}
              style={styles.img3}
            />
            <Text style={styles.text3}>
              {/* {
                "You receive a reward of AED 10, when they book a service of AED 100 or More."
              } */}
              {i18n.t('langChange:howPt3')}
            </Text>
          </View>
          <View style={styles.row2}>
            <Image
              source={require('../../assets/reward-4.png')}
              style={styles.img4}
            />
            <Text style={styles.text3}>
              {/* {
                "Share Your purchase with 3 friends and you will get AED 10 in your wallet"
              } */}
              {i18n.t('langChange:howPt4')}
            </Text>
          </View>
        </View>
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  containerStyle: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(20),
  },
  heading: {
    color: Colors.white,
    paddingLeft: RFValue(15),
    fontSize: RFValue(17),
    fontWeight: 'bold',
  },
  containerRow: {
    backgroundColor: 'rgba(33, 109, 158, 0.3)',
  },
  containerRow1: {
    flexDirection: 'row',
    padding: RFValue(15),
  },
  gift: {
    width: RFValue(80),
    height: RFValue(80),
  },
  ref: {
    textAlign: 'center',
    paddingVertical: RFValue(10),
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconStyle: {
    backgroundColor: Colors.white,
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(100),
  },
  iconName: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: RFValue(20),
    paddingTop: RFValue(5),
  },
  containerStyle1: {
    marginHorizontal: RFValue(15),
  },
  heading2: {
    fontWeight: 'bold',
    paddingVertical: RFValue(10),
  },
  row1: {
    flexDirection: 'row',
  },
  row2: {
    flexDirection: 'row',
    marginVertical: RFValue(10),
  },
  text1: {
    fontSize: RFValue(12.5),
    flex: 1,
    flexWrap: 'wrap',
  },
  text2: {
    fontSize: RFValue(12.5),
    paddingTop: RFValue(20),
    flex: 1,
    flexWrap: 'wrap',
  },
  text3: {
    fontSize: RFValue(12.5),
    flex: 1,
    flexWrap: 'wrap',
  },
  text4: {
    marginVertical: RFValue(10),
    paddingHorizontal: RFValue(15),
    flex: 1,
    flexWrap: 'wrap',
    fontSize: RFValue(12.5),
  },
  img1: {
    width: RFValue(35),
    height: RFValue(35),
    marginHorizontal: RFValue(10),
  },
  img2: {
    width: RFValue(55),
    height: RFValue(60),
  },
  img3: {
    width: RFValue(38),
    height: RFValue(38),
    marginHorizontal: RFValue(10),
    borderRadius: RFValue(100),
  },
  img4: {
    width: RFValue(35),
    height: RFValue(35),
    marginHorizontal: RFValue(10),
  },
});

export default RewardScreen;
