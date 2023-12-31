import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {StyleSheet, Text, View, Image, Alert, Platform} from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import i18n from 'i18next';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
} from 'react-native-permissions';
import {launchImageLibrary} from 'react-native-image-picker';

import {post_review} from '../store/actions/request';
import Colors from '../constants/Colors';
import {useError} from '../hooks/useError';

const stars = [1, 2, 3, 4, 5];

const PostReviewScreen = ({route, navigation}) => {
  const partner_id = route.params.provider;
  const booking_id = route.params.booking_id;

  const setError = useError();
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [service, setService] = useState(5);
  const [money, setMoney] = useState(5);
  const [behaviour, setBehaviour] = useState(5);

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
      selectionLimit: 1,
    });

    if ('assets' in result) {
      const [asset] = result.assets;
      setImage({
        uri: asset.uri,
        name: asset.fileName,
        type: asset.type,
      });
    }
  };

  const onSubmitHandler = async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(
        post_review(
          message,
          image,
          String(service),
          String(money),
          String(behaviour),
          partner_id,
          booking_id,
        ),
      );

      setLoading(false);
      Alert.alert(
        i18n.t('langChange:alert'),
        i18n.t('langChange:alertRevSubmit'),
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Text style={styles.text5}>{i18n.t('langChange:msg')}</Text>
      <TextInput
        mode="outlined"
        placeholder={i18n.t('langChange:typeHere')}
        numberOfLines={8}
        multiline
        style={styles.input1}
        value={message}
        onChangeText={setMessage}
      />
      <View style={styles.row1}>
        <Text style={styles.text2}>{i18n.t('langChange:rateService')}</Text>
        <View style={{flexDirection: 'row'}}>
          {stars.map(star => (
            <Ionicons
              name="md-star"
              size={RFValue(24)}
              color={service >= star ? Colors.darkYellow : 'grey'}
              onPress={() => setService(star)}
              style={{paddingRight: RFValue(5)}}
            />
          ))}
        </View>
      </View>
      <View style={styles.row1}>
        <Text style={styles.text2}>{i18n.t('langChange:valForMoney')}</Text>
        <View style={{flexDirection: 'row'}}>
          {stars.map(star => (
            <Ionicons
              name="md-star"
              size={RFValue(24)}
              color={money >= star ? Colors.darkYellow : 'grey'}
              onPress={() => setMoney(star)}
              style={{paddingRight: RFValue(5)}}
            />
          ))}
        </View>
      </View>
      <View style={styles.row1}>
        <Text style={styles.text2}>{i18n.t('langChange:behavRate')}</Text>
        <View style={{flexDirection: 'row'}}>
          {stars.map(star => (
            <Ionicons
              name="md-star"
              size={RFValue(24)}
              color={behaviour >= star ? Colors.darkYellow : 'grey'}
              onPress={() => setBehaviour(star)}
              style={{paddingRight: RFValue(5)}}
            />
          ))}
        </View>
      </View>
      <Button
        mode="outlined"
        onPress={choosePhotoFromLibrary}
        icon="attachment"
        uppercase={false}
        style={{
          width: '60%',
          marginVertical: RFValue(10),
          borderRadius: RFValue(50),
          alignSelf: 'center',
        }}>
        {i18n.t('langChange:attachBtn')}
      </Button>
      {image?.uri && (
        <View style={styles.imgContainer}>
          <Image source={{uri: image?.uri}} style={styles.img} />
        </View>
      )}
      <View style={styles.row2}>
        {image?.uri && (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.text4}>{'uploaded successfully'}</Text>
            <Ionicons name="checkmark-done" size={24} color={Colors.primary} />
          </View>
        )}
      </View>
      <Button
        mode="contained"
        style={styles.btn}
        contentStyle={{height: 50}}
        onPress={onSubmitHandler}
        loading={loading}
        disabled={loading}>
        {i18n.t('langChange:submitBtn')}
      </Button>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: RFValue(10),
  },
  input1: {
    marginBottom: RFValue(15),
    backgroundColor: Colors.white,
    marginHorizontal: RFValue(10),
  },
  row1: {
    flexDirection: 'row',
    marginBottom: RFValue(10),
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(10),
  },
  row2: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input2: {
    backgroundColor: Colors.white,
    width: '40%',
  },
  text2: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: Colors.black,
  },
  text4: {
    fontSize: RFValue(15),
    marginRight: RFValue(5),
    color: Colors.primary,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  btn: {
    marginVertical: RFValue(15),
    width: '40%',
    alignSelf: 'center',
    borderRadius: RFValue(50),
    marginBottom: RFValue(30),
  },
  imgContainer: {
    width: wp('60%'),
    height: hp('22%'),
    margin: RFValue(5),
    alignSelf: 'center',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  heading: {
    marginVertical: RFValue(20),
    fontWeight: 'bold',
    marginLeft: RFValue(10),
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  text5: {
    paddingLeft: RFValue(10),
    color: Colors.black,
    fontSize: RFValue(15),
    fontWeight: 'bold',
  },
});

export default PostReviewScreen;
