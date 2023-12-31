import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, TextInput, Title } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import I18n from '../../i18n';
import i18n from 'i18next';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const RateUsScreen = (props) => {
  const [service, setService] = useState(0);
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();

  const _onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.rate_us(service, message));
      // setError('Feedback Submitted!');
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Feedback Submitted!'
      })
      props.navigation.goBack();

    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [service, message, props.navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        { text: 'OK', onPress: () => setError(null) },
      ]);
    }
  }, [error]);

  return (
    <KeyboardAwareScrollView style={styles.screen}>
      <Title style={styles.title}>{i18n.t('langChange:shareYourExp')}</Title>
      <View style={styles.rowContainer}>
        <Ionicons
          name="md-star"
          size={32}
          color={service !== 0 ? Colors.darkYellow : 'grey'}
          onPress={() => {
            setService(1);
          }}
          style={{ paddingRight: RFValue(5) }}
        />
        <Ionicons
          name="md-star"
          size={32}
          color={service >= 2 ? Colors.darkYellow : 'grey'}
          onPress={() => {
            setService(2);
          }}
          style={{ paddingRight: RFValue(5) }}
        />
        <Ionicons
          name="md-star"
          size={32}
          color={service >= 3 ? Colors.darkYellow : 'grey'}
          onPress={() => {
            setService(3);
          }}
          style={{ paddingRight: RFValue(5) }}
        />
        <Ionicons
          name="md-star"
          size={32}
          color={service >= 4 ? Colors.darkYellow : 'grey'}
          onPress={() => {
            setService(4);
          }}
          style={{ paddingRight: RFValue(5) }}
        />
        <Ionicons
          name="md-star"
          size={32}
          color={service >= 5 ? Colors.darkYellow : 'grey'}
          onPress={() => {
            setService(5);
          }}
          style={{ paddingRight: RFValue(5) }}
        />
      </View>
      <TextInput
        placeholder={i18n.t('langChange:typeYourComment')}
        mode="outlined"
        style={styles.input}
        numberOfLines={10}
        multiline
        value={message}
        onChangeText={setMessage}
      />
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{ height: 50 }}
        labelStyle={{ fontWeight: 'bold', fontSize: RFValue(15) }}
        loading={loading}
        disabled={loading}
        onPress={_onSubmitHandler}>
        {i18n.t('langChange:submitBtn')}
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: RFValue(10),
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: RFValue(20),
    justifyContent: 'center',
    marginBottom: RFValue(10),
  },
  icon: {
    marginRight: RFValue(10),
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Colors.white,
  },
  btn: {
    width: '90%',
    alignSelf: 'center',
    marginVertical: RFValue(20),
  },
});

export default RateUsScreen;
