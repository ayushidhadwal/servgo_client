import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {FAB} from 'react-native-paper';
import i18n from 'i18next';

import * as addressActions from '../../store/actions/address';
import {Loader} from '../../components/common/Loader';
import Colors from '../../constants/Colors';
import {AddressItem} from '../../components/address/AddressItem';
import {useError} from '../../hooks/useError';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

const AddressBookScreen = ({navigation}) => {
  const {addresses} = useSelector(state => state.address);
  const [loading, setLoading] = useState(true);

  const setError = useError();
  const dispatch = useDispatch();

  const _getAddresses = async () => {
    try {
      setError(null);
      setLoading(true);

      await dispatch(addressActions.setAddresses());
    } catch (e) {
      setError('Please add a address..');
    }

    setLoading(false);
  };

  useEffect(() => {
    _getAddresses().then(() => null);
  }, []);

  const _updateDefaultAddress = async addressId => {
    try {
      setError(null);
      await dispatch(addressActions.setDefaultAddress(addressId));
    } catch (e) {
      setError(e.message);
    }
  };

  const _renderItem = ({item, index}) => (
    <AddressItem
      item={item}
      index={index}
      onSetActive={_updateDefaultAddress}
      onPress={() =>
        navigation.navigate('EditAddress', {
          addressId: item.id,
        })
      }
    />
  );

  const {bottom} = useSafeAreaInsets();

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.screen}>
      <FAB
        style={[styles.fab, {bottom: bottom || 10}]}
        icon="plus"
        onPress={() => navigation.navigate('NewAddress')}
        color={Colors.white}
      />
      {addresses.length === 0 ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>No Address</Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={_renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export const screenOptions = () => ({
  headerTitle: i18n.t('langChange:addressBook'),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: RFValue(10),
  },
  rowHeading: {
    flex: 0.5,
    fontWeight: 'bold',
  },
});

export default AddressBookScreen;
