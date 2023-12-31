import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Colors from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

const WalletScreen = ({ navigation }) => {
  const { Profile } = useSelector(state => state.user);
  const { t } = useTranslation('langChange');
  return (
    <View style={styles.screen}>
      <Pressable
        style={styles.categorySection3}
        onPress={() => navigation.navigate('Reward')}>
        <Image source={require('../../assets/gift.png')} style={styles.img} />
        <View>
          <Text style={styles.ref}>{t('referEarn')}</Text>
          <Text>{t('referEarnMsg')}</Text>
        </View>
        <AntDesign
          name="right"
          size={24}
          color="black"
          style={styles.rightIcon}
        />
      </Pressable>
      <View style={styles.categorySection4}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={require('../../assets/walletCash.png')}
            style={styles.img2}
          />

          <Text style={styles.cash1}>{t('servGoCash')}</Text>
        </View>
        <Text style={styles.cash}>
          {t('aed')} {Profile.wallet}
        </Text>
      </View>

      <Pressable
        style={styles.categorySection3}
        onPress={() => navigation.navigate('walletActivity')}>
        <Text style={styles.cash1}>{t('walletActivity')}</Text>
        <AntDesign
          name="right"
          size={24}
          color="black"
          style={styles.rightIcon}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  categorySection3: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(10),
    backgroundColor: Colors.white,
    marginTop: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categorySection4: {
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(25),
    backgroundColor: Colors.white,
    marginTop: RFValue(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    width: RFValue(35),
    height: RFValue(35),
  },
  ref: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  rightIcon: {
    alignSelf: 'flex-end',
    paddingBottom: RFValue(8),
  },
  img2: {
    width: RFValue(35),
    height: RFValue(35),
  },
  cash1: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
    paddingLeft: RFValue(30),
  },
  cash: {
    fontWeight: 'bold',
    fontSize: RFValue(15),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: RFValue(15),
  },
  question: {
    fontSize: RFValue(15),
  },
  wallet: {
    padding: RFValue(15),
    fontSize: RFValue(15),
  },
});

export const screenOptions = () => ({
  headerTitle: i18n.t('langChange:myWallet'),
});

export default WalletScreen;
