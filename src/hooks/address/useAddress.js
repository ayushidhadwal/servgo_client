import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import * as addressActions from '../../store/actions/address';
import {useNavigation} from '@react-navigation/native';

export const useGetAddressList = () => {
  const [loading, setLoading] = useState(true);
  const {addresses} = useSelector(state => state.address);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const setError = useError();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setError(null);
      setLoading(true);
      try {
        await dispatch(addressActions.setAddresses());
      } catch (e) {
        setError('Please add a address..');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, setError]);

  return [addresses, loading];
};
