import React, {useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Button, TextInput} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import i18n from 'i18next';

import Colors from '../../constants/Colors';
import * as requestAction from '../../store/actions/request';
import {useError} from '../../hooks/useError';

const ComplaintForm = props => {
  const {booking_id, partner_id} = props.route.params;

  const [subject, setSubject] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const dispatch = useDispatch();

  const onSubmitHandler = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        requestAction.raise_complaint(partner_id, booking_id, subject, comment),
      );
      setSubject('');
      setComment('');
      setError('Complaint Registered Successfully!');
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [setError, dispatch, partner_id, booking_id, subject, comment]);

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView style={{padding: 20}}>
        <TextInput
          mode="outlined"
          label={i18n.t('langChange:subj')}
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
        />
        <TextInput
          mode="outlined"
          label={i18n.t('langChange:complaint')}
          style={styles.input1}
          multiline
          numberOfLines={10}
          value={comment}
          onChangeText={setComment}
        />
        <Button
          mode="contained"
          style={styles.btn}
          onPress={onSubmitHandler}
          loading={loading}
          disabled={loading}>
          {i18n.t('langChange:submitBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  input: {
    marginBottom: RFValue(10),
    backgroundColor: Colors.white,
  },
  input1: {
    marginBottom: RFValue(30),
    backgroundColor: Colors.white,
  },
  btn: {
    borderRadius: RFValue(20),
    width: '60%',
    alignSelf: 'center',
    marginBottom: RFValue(30),
  },
});
export default ComplaintForm;
