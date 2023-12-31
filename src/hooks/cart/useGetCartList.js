import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import * as cartActions from '../../store/actions/cart';
import {useError} from '../useError';

export const useGetCartList = () => {
  const [loading, setLoading] = useState(true);
  const setError = useError();
  const navigation = useNavigation();

  const {ProductCartList, ServiceCartList} = useSelector(state => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(cartActions.getCartList());
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation, dispatch, setError]);

  return [ProductCartList, ServiceCartList, loading];
};
