import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import * as orderActions from '../../store/actions/order';

export const useOrderDetails = id => {
  const [loading, setLoading] = useState(true);
  const setError = useError();

  const {orderDetails} = useSelector(state => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(orderActions.getOrderDetails(id));
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [dispatch, setError]);

  return [orderDetails, loading];
};
