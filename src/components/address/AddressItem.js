import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import i18n from 'i18next';
import { Switch } from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import * as addressActions from '../../store/actions/address';
import Colors from '../../constants/Colors';
import { TextRow } from '../TextRow';
import { useError } from '../../hooks/useError';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export const AddressItem = ({
  item,
  index,
  onPress,
  onSetActive,
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const _deleteAddress = async addressId => {
    try {
      setLoading(true);
      setError(null);
      await dispatch(addressActions.deleteAddress(addressId));
      // alert('Success!');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Address deleted'
      })
      navigation.navigate('AddressBook');
    } catch (e) {
      setLoading(false);
      setError(e.message);
    }
    setLoading(false);
  };

  const deleteAddress = addressId => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        { text: 'OK', onPress: () => _deleteAddress(addressId) },
      ],
      { cancelable: false }
    )
  }

  return (
    <Pressable
      style={[styles.addressCard, { marginTop: index === 0 ? RFValue(12) : 0 }]}>
      <Feather
        name="edit"
        size={18}
        color={Colors.primary}
        style={{
          alignSelf: 'flex-end',
          position: 'absolute',
          top: 10,
          right: 10,
        }}
        onPress={() => onPress(item.id)}
      />
      <TextRow
        heading={i18n.t('langChange:buildingName')}
        desc={item.buildingName}
      />
      <TextRow heading={i18n.t('langChange:address')} desc={item.address} />
      <TextRow
        heading={i18n.t('langChange:countrySimple')}
        desc={item.countryName}
      />
      <TextRow heading={i18n.t('langChange:citySimple')} desc={item.cityName} />
      <TextRow
        heading={i18n.t('langChange:phone')}
        desc={`${item.phoneCode} ${item.phoneNumber}`}
      />
      <View style={styles.row}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch
            color={'green'}
            value={item.isDefault}
            disabled={item.isDefault}
            onValueChange={() => onSetActive(item.id)}
          />
          <Text
            style={{
              color: item.isDefault ? 'green' : 'red',
              fontWeight: 'bold',
              marginLeft: RFValue(5),
            }}>
            {item.isDefault
              ? i18n.t('langChange:active')
              : i18n.t('langChange:inactive')}
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator color={'darkred'} size={'small'} />
        ) : (
          <MaterialIcons
            name="delete"
            size={24}
            color="darkred"
            // onPress={() => _deleteAddress(item.id)}
            onPress={() => deleteAddress(item.id)}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
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
    marginTop: RFValue(10),
  },
});
