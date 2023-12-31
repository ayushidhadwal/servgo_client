import React, {useState, useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, View, Platform, Text, Alert, Linking} from 'react-native';
import {Button, TextInput, Title} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import * as requestAction from '../../store/actions/request';
import Colors from '../../constants/Colors';

const HelpScreen = ({navigation}) => {
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {t} = useTranslation('langChange');
  const dispatch = useDispatch();

  const choosePhotoFromLibrary = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    )
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            _openImagePicker();
            break;
          case RESULTS.UNAVAILABLE:
            setError('This feature is not available on this device!');
            break;
          case RESULTS.DENIED:
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.PHOTO_LIBRARY
                : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
            ).then(requestResult => {
              if (requestResult === RESULTS.GRANTED) {
                _openImagePicker();
              }
            });
            break;
          case RESULTS.LIMITED:
            _openImagePicker();
            break;
          case RESULTS.BLOCKED:
            setError(
              'The permission is denied! Please enable storage permission.',
            );
            openSettings().catch(settingsErr =>
              setError('Unable to open settings!'),
            );
            break;
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const _openImagePicker = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
    });

    if ('assets' in result) {
      const [asset] = result.assets;

      setImage({
        name: asset.fileName,
        uri: asset.uri,
        type: asset.type,
      });
    }
  };

  const _insertUrgentService = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(requestAction.urgentServices(image, comment));
      setImage(null);
      setComment('');
      Toast.show({
        type: 'success',
        text1: 'Urgent Request!',
        text2: 'Request sent successfully!',
      });
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [comment, dispatch, image, navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Alert', error.toString(), [
        {text: 'OK', onPress: () => setError(null)},
      ]);
    }
  }, [error]);

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <>
          <Title style={styles.heading}>{t('submitQuery')}</Title>
          <TextInput
            mode="outlined"
            label={t('desc')}
            style={styles.input}
            multiline
            numberOfLines={10}
            value={comment}
            onChangeText={setComment}
          />
          <Button
            mode="outlined"
            icon="attachment"
            style={styles.Btn}
            labelStyle={{
              fontSize: RFValue(13),
              color: Colors.black,
            }}
            uppercase={false}
            onPress={choosePhotoFromLibrary}>
            {t('attachBtn')}
          </Button>
          {image !== null && (
            <View style={styles.content}>
              <Text style={styles.text}>Uploaded Successfully</Text>
              <Ionicons
                style={{paddingBottom: RFValue(5)}}
                name="checkmark-done"
                size={24}
                color={Colors.primary}
              />
            </View>
          )}
          <Button
            mode="contained"
            style={styles.submit}
            loading={loading}
            disabled={loading}
            onPress={_insertUrgentService}>
            {t('submitBtn')}
          </Button>
        </>
      </KeyboardAwareScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(10),
  },
  heading: {
    marginBottom: RFValue(15),
    fontWeight: 'bold',
  },
  Btn: {
    alignSelf: 'center',
    marginVertical: RFValue(15),
    borderRadius: RFValue(100),
    width: '60%',
  },
  submit: {
    width: '90%',
    alignSelf: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginBottom: RFValue(20),
    color: Colors.primary,
  },
});

export default HelpScreen;
