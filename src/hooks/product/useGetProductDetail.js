import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import * as productActions from '../../store/actions/product';
import {useError} from '../useError';
import {useNavigation} from '@react-navigation/native';

export const useGetProductDetail = productId => {
  const [loading, setLoading] = useState(true);

  const {productDetails} = useSelector(state => state.product);

  const setError = useError();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(productActions.getProductDetail(productId));
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [dispatch, navigation, productId, setError]);

  return [productDetails, loading];
};
