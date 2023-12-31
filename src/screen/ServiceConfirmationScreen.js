import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert, Image, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, RadioButton, TextInput} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';

import Colors from '../constants/Colors';
import {useError} from '../hooks/useError';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';
import {setServiceConfirmation} from '../store/actions/request';

const ServiceConfirmationScreen = props => {
  const booking_Id = props.route.params.booking_id;

  const {t} = useTranslation('langChange');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState('YES');
  const [reason, setReason] = useState('');
  const [img, setImg] = useState([]);

  const dispatch = useDispatch();
  const setError = useError();

  const _deleteImg = (i, url) => {
    setImg(prevState => {
      const d = [...prevState];
      const x = d.findIndex(n => n.uri === url);
      if (x >= 0) {
        d.splice(x, 1);
      }
      return d;
    });
  };

  const _onSubmitHandler = async () => {
    if ((checked === 'NO' && img.length === 0) || reason === '') {
      setError(t('langChange:fillAlert'));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await dispatch(setServiceConfirmation(booking_Id, checked, reason, img));
      Alert.alert(t('alert'), t('sentAlert'), [
        {text: 'OK', onPress: () => props.navigation.goBack()},
      ]);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
    setLoading(false);
  };

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
      quality: 0.5,
      selectionLimit: 0,
    });

    if ('assets' in result) {
      setImg(
        result.assets.map(asset => {
          return {
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          };
        }),
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['bottom']}>
      <KeyboardAwareScrollView
        showsverticalscrollindicator={false}
        style={{flex: 1, backgroundColor: '#ffff'}}>
        <Text style={styles.heading}>{t('serviceConf')}</Text>
        <View style={styles.rowStyle}>
          <View style={styles.radioStyle}>
            <RadioButton.Android
              value="YES"
              status={checked === 'YES' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('YES')}
              color={Colors.primary}
            />
            <Text>{t('yes')}</Text>
          </View>
          <View style={[styles.radioStyle, {marginLeft: RFValue(10)}]}>
            <RadioButton.Android
              value="NO"
              status={checked === 'NO' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('NO')}
              color={Colors.primary}
            />
            <Text>{t('no')}</Text>
          </View>
        </View>
        <TextInput
          mode={'outlined'}
          placeholder={t('addComment')}
          numberOfLines={10}
          multiline
          value={reason}
          onChangeText={text => setReason(text)}
          style={{
            marginVertical: RFValue(20),
          }}
        />
        {checked === 'NO' && (
          <View
            style={{
              alignSelf: 'flex-start',
            }}>
            {img.length === 0 && (
              <Text style={{color: '#ba041c'}}>required * </Text>
            )}
            <Button
              mode="outlined"
              uppercase={false}
              icon={'attachment'}
              style={styles.btnAttachment}
              onPress={choosePhotoFromLibrary}>
              {t('attachBtn')}
            </Button>
            {img.length > 0 && (
              <Text
                style={{
                  color: 'grey',
                  fontStyle: 'italic',
                  marginVertical: RFValue(10),
                }}>
                {img.length} {t('imgUpload')}
              </Text>
            )}
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginBottom: RFValue(30),
          }}>
          {img.map((item, i) => (
            <View key={item.name}>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  marginRight: RFValue(10),
                  marginBottom: RFValue(10),
                }}
                source={{uri: item.uri}}
                key={i}
              />
              <AntDesign
                name="closecircle"
                size={24}
                color="#fc0335"
                style={styles.fab}
                onPress={() => _deleteImg(i, item.uri)}
              />
            </View>
          ))}
        </View>
        <Button
          mode="contained"
          style={styles.btnStyles}
          onPress={_onSubmitHandler}
          loading={loading}
          disabled={loading}>
          {t('submitBtn')}
        </Button>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: RFValue(20),
  },
  heading: {
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
  radioStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowStyle: {
    flexDirection: 'row',
  },
  btnAttachment: {
    width: '50%',
    borderRadius: RFValue(100),
  },
  btnStyles: {
    width: '50%',
    alignSelf: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 10,
    right: 5,
    top: 0,
  },
});

export default ServiceConfirmationScreen;
