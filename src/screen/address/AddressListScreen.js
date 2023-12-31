import React, { useState } from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button, RadioButton, Subheading } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Loader } from '../../components/common/Loader';
import Colors from '../../constants/Colors';
import { useGetAddressList } from '../../hooks/address/useAddress';

const AddressListScreen = ({ route, navigation }) => {
  const { service, subService, childService } = route.params;

  console.log(service, subService, childService);

  const { t } = useTranslation('langChange');

  const [addresses, loading] = useGetAddressList();
  const [address, setAddress] = useState('');

  const onPressHandler = addressId => {
    setAddress(addressId);
  };

  const { bottom } = useSafeAreaInsets();

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <View style={{flex:1}}>

        {addresses.length === 0 ? (
          <Pressable
            onPress={() => navigation.navigate('AddressBook')}
            style={[
              styles.radioButtonContainer,
              {
                alignItems: 'center',
                marginBottom: RFValue(12),
                borderWidth: 2,
                borderColor: '#dedede',
                borderStyle: 'dashed',
              },
            ]}>
            <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
              {t('addAddress')}
            </Text>
          </Pressable>
        ) : (
          <ScrollView >
            <Subheading style={[styles.summaryHeading, { marginTop: RFValue(12) }]}>
              {t('selectAddress')}
            </Subheading>
            <RadioButton.Group
              onValueChange={newValue => setAddress(newValue)}
              value={address}>
              {addresses.map(item => (
                <Pressable
                  onPress={() => onPressHandler(item.id)}
                  key={item.id}
                  style={styles.radioButtonContainer}>
                  <RadioButton.Android value={item.id} color={Colors.primary} />
                  <Text style={styles.radioHeading}>
                    {item.name}, {item.address}, {item.cityName},{' '}
                    {item.countryName}
                  </Text>
                </Pressable>
              ))}
            </RadioButton.Group>

            <Pressable
              onPress={() => navigation.navigate('AddressBook')}
              style={[
                styles.radioButtonContainer,
                {
                  alignItems: 'center',
                  marginBottom: RFValue(12),
                  borderWidth: 2,
                  borderColor: '#dedede',
                  borderStyle: 'dashed',
                },
              ]}>
              <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                {t('addAddress')}
              </Text>
            </Pressable>
          </ScrollView>
        )}
      </View>

      <View style={[styles.btnContainer, { bottom: bottom || 10 }]}>
        <Button
          mode="contained"
          style={styles.btnStyles}
          onPress={() =>
            navigation.navigate('SlotBooking', {
              service: service,
              subService: subService,
              childService: childService,
              addressId: address,
            })
          }
          disabled={address === ''}>
          {t('nextBtn')}
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  addressCard: {
    borderRadius: RFValue(8),
    marginBottom: RFValue(12),
    backgroundColor: 'white',
    marginHorizontal: RFValue(12),
    padding: RFValue(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: RFValue(10),
    marginTop: RFValue(10),
  },
  rowHeading: {
    flex: 0.5,
    fontWeight: 'bold',
  },
  selectAddress: {
    borderWidth: RFValue(5),
    borderColor: Colors.primary,
  },
  btnContainer: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
  },
  btnStyles: {
    width: '70%',
    alignSelf: 'center',
    marginVertical: RFValue(12),
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    marginHorizontal: RFValue(12),
    marginTop: RFValue(12),
    padding: RFValue(10),
  },
  radioHeading: {
    fontWeight: 'bold',
    width: '80%',
  },
  summaryHeading: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default AddressListScreen;
