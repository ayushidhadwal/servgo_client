import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import * as orderActions from '../../store/actions/order';
import {useNavigation} from '@react-navigation/native';

export const useGetOrderList = () => {
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const setError = useError();
  const {OrderList} = useSelector(state => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(orderActions.getOrderList());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });
  }, [dispatch, navigation, setError]);

  return [OrderList, loading];
};
