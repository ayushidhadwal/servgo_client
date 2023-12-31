import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {useError} from '../useError';
import * as productActions from '../../store/actions/product';

export const useGetCategoryList = () => {
  const [loading, setLoading] = useState(true);
  const setError = useError();

  const {CategoryList} = useSelector(state => state.product);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);

      try {
        await dispatch(productActions.getCategoryList());
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [dispatch, setError]);

  return [CategoryList, loading];
};
