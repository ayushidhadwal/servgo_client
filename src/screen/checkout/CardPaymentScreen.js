import React, { useCallback, useState } from 'react';
import { Button, FormControl, HStack, Input, Text } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';

import * as cartAction from '../../store/actions/cart';
import Colors from '../../constants/Colors';
import { useError } from '../../hooks/useError';

const CardPaymentScreen = () => {
  const [cardNo, setCardNo] = useState('');
  const [cvvNumber, setCvvNumber] = useState('');
  const [ccExpiryMonth, setCcExpiryMonth] = useState('');
  const [ccExpiryYear, setCcExpiryYear] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const setError = useError();

  const onPressHandler = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await dispatch(
        cartAction.productPayment(
          cardNo,
          cvvNumber,
          ccExpiryMonth,
          ccExpiryYear,
        ),
      );
      alert('Done !!!');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [cardNo, ccExpiryMonth, ccExpiryYear, cvvNumber, dispatch, setError]);

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{ backgroundColor: Colors.white }}>
        <Text textAlign={'center'} bold fontSize={'md'} my={5}>
          Enter Your Card Details
        </Text>
        <FormControl w={'100%'} alignSelf={'center'} isInvalid={false} mb={2}>
          <FormControl.Label>Card Number</FormControl.Label>
          <Input
            variant="underlined"
            size={'lg'}
            value={cardNo}
            onChangeText={setCardNo}
            keyboardType={'number-pad'}
            maxLength={16}
          />
        </FormControl>
        <HStack justifyContent={'space-between'}>
          <FormControl w={'42%'} alignSelf={'center'} isInvalid={false} mb={2}>
            <FormControl.Label>Month</FormControl.Label>
            <Input
              variant="underlined"
              size={'lg'}
              value={ccExpiryMonth}
              onChangeText={setCcExpiryMonth}
              keyboardType={'number-pad'}
              maxLength={2}
            />
          </FormControl>
          <FormControl w={'42%'} alignSelf={'center'} isInvalid={false} mb={2}>
            <FormControl.Label>Year</FormControl.Label>
            <Input
              variant="underlined"
              size={'lg'}
              value={ccExpiryYear}
              onChangeText={setCcExpiryYear}
              keyboardType={'number-pad'}
              maxLength={4}
            />
          </FormControl>
        </HStack>
        <FormControl w={'45%'} isInvalid={false} mb={2}>
          <FormControl.Label>Cvv</FormControl.Label>
          <Input
            variant="underlined"
            size={'lg'}
            value={cvvNumber}
            onChangeText={setCvvNumber}
            keyboardType={'number-pad'}
            maxLength={4}
          />
        </FormControl>
        <Button
          isDisabled={loading}
          isLoading={loading}
          my={10}
          onPress={() => onPressHandler()}>
          Submit
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};
export default CardPaymentScreen;
