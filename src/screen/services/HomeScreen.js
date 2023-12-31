import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { StatusBar } from 'react-native';
import { Box } from 'native-base';

import Colors from '../../constants/Colors';
import Categories from '../../components/Categories';
import * as userActions from '../../store/actions/user';
import * as homeAction from '../../store/actions/home';
import { Loader } from '../../components/common/Loader';
import { useError } from '../../hooks/useError';
import * as productActions from '../../store/actions/product';

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const setHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        dispatch(userActions.get_user_profile()),
        dispatch(homeAction.setServiceType()),
        dispatch(homeAction.getTestimonial()),
        dispatch(productActions.getCategoryList()),
      ]);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [dispatch, setError]);

  useEffect(() => {
    setHomeData();
  }, [navigation, setHomeData]);

  return (
    <Box flex={1} bg={'white'}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
      {loading ? (
        <Loader />
      ) : (
        <Categories
          navigation={navigation}
          onCategoryPress={(
            serviceId,
            serviceNameEN,
            serviceNameAR,
            serviceIndex,
          ) =>
            navigation.navigate('SubCategories', {
              serviceId,
              serviceNameEN,
              serviceNameAR,
              serviceIndex,
              bookingTime: '',
              addressId: '',
              qty:'',
              bookingDate:'',
              partnerId:'',
              selectedId:''
            })
          }
        />
      )}
    </Box>
  );
};

export default HomeScreen;
