import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

import Colors from '../constants/Colors';

const ProviderRating = () => {
  const {providerProfile} = useSelector(state => state.request);
  const {t} = useTranslation('langChange');

  const totalRating = providerProfile.totalRating || 5;
  const serviceRating = serviceRating || 5;
  const valueForMoneyRating = providerProfile.valueForMoneyRating || 5;
  const behaviourRating = providerProfile.behaviourRating || 5;

  return (
    <View style={{paddingHorizontal: RFValue(10)}}>
      <View style={styles.star}>
        <Title style={styles.heading}>{t('overallRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={totalRating !== 0 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={totalRating >= 2 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={totalRating >= 3 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={totalRating >= 4 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={totalRating >= 5 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Title style={styles.heading}>{t('serviceRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={serviceRating !== 0 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={serviceRating >= 2 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={serviceRating >= 3 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={serviceRating >= 4 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={serviceRating >= 5 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Title style={styles.heading}>{t('valForMoneyRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={valueForMoneyRating !== 0 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={valueForMoneyRating >= 2 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={valueForMoneyRating >= 3 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={valueForMoneyRating >= 4 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={valueForMoneyRating >= 5 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
      </View>
      <View style={styles.star}>
        <Title style={styles.heading}>{t('behavRating')}: </Title>
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={behaviourRating !== 0 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={behaviourRating >= 2 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={behaviourRating >= 3 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={behaviourRating >= 4 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
        <Ionicons
          name="md-star"
          size={RFValue(16)}
          color={behaviourRating >= 5 ? Colors.darkYellow : 'grey'}
          style={styles.icon}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  star: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    fontSize: RFValue(14),
  },
  icon: {
    paddingTop: RFValue(5),
  },
});

export default ProviderRating;
