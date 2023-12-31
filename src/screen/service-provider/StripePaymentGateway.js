import React, {useCallback, useEffect, useState} from 'react';
import {useStripe} from '@stripe/stripe-react-native';
import {Button} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';

import {useError} from '../../hooks/useError';
import * as cartAction from '../../store/actions/cart';

export const StripePaymentGateway = ({
  paymentIntent,
  ephemeralKey,
  customer,
  country,
  username,
  refundWalletCheck,
  walletCheck,
}) => {
  const navigation = useNavigation();

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [loading, setLoading] = useState(true);
  const [noError, setNoError] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const initializePaymentSheet = useCallback(async () => {
    setLoading(true);
    setErrMsg('');

    try {
      const {error} = await initPaymentSheet({
        merchantDisplayName: 'Servgo',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        defaultBillingDetails: {
          name: username,
          address: {country: country},
        },
      });

      if (!error) {
        setNoError(true);
      }
    } catch (e) {
      setNoError(false);
      setErrMsg('Unable to load payment gateway.');
    } finally {
      setLoading(false);
    }
  }, [
    country,
    customer,
    ephemeralKey,
    initPaymentSheet,
    paymentIntent,
    username,
  ]);

  useEffect(() => {
    if (ephemeralKey) {
      initializePaymentSheet();
    }
  }, [ephemeralKey, initializePaymentSheet]);

  const setMessage = useError();

  const dispatch = useDispatch();
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      setMessage(error.message);
    } else {
      try {
        setLoading(true);

        await dispatch(
          cartAction.productPayment(refundWalletCheck, walletCheck),
        );

        setLoading(false);
        Toast.show({
          type: 'success',
          text1: 'Order Payment!',
          text2: 'Order payment is successful!',
        });
        navigation.navigate('Orders');
      } catch (e) {
        setNoError(false);
        setLoading(false);
        setMessage(e.message);
      }
    }
  };

  return (
    <Button
      isLoading={loading}
      isDisabled={loading || !noError}
      mt={4}
      mb={10}
      onPress={openPaymentSheet}>
      {errMsg ? errMsg : 'Pay'}
    </Button>
  );
};
