import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button, Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

import * as requestAction from '../store/actions/request';
import {TextRow} from './TextRow';
import {URL} from '../constants/base_url';
import {useError} from '../hooks/useError';
import {Loader} from './common/Loader';

const JobDescription = ({
  status,
  payment_status,
  bookingId,
  navigation,
  confirmStatus,
  confirmUserStatus,
  confirmUserImages,
}) => {
  const {t} = useTranslation('langChange');
  const [loading, setLoading] = useState(false);

  const setError = useError();
  const {pictures} = useSelector(state => state.request);

  const dispatch = useDispatch();

  useEffect(() => {
    const completedServicePicture = async () => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(requestAction.getCompleteServicePictures(bookingId));
      } catch (e) {
        setError(e.message);
      }
      setLoading(false);
    };

    if (status === 'COMPLETED' && payment_status === 'SUCCESS') {
      completedServicePicture();
    }
  }, [bookingId, dispatch, payment_status, setError, status]);

  if (loading) {
    return <Loader />;
  }

  return (
    <View>
      {status === 'COMPLETED' && payment_status === 'SUCCESS' ? (
        <View style={[styles.card, {marginBottom: RFValue(10)}]}>
          <Text style={[styles.bold, {fontSize: RFValue(14)}]}>
            {t('jobCompDesc')}
          </Text>
          <Divider style={styles.marginVertical} />
          <TextRow heading={t('date')} desc={pictures.date} />
          <TextRow heading={t('time')} desc={pictures.time} />
          <Divider style={{marginBottom: RFValue(5)}} />
          <TextRow heading={t('desc')} desc={pictures.description} />
          <Divider />
          <View style={styles.gallery}>
            {pictures.images.map((i, index) => (
              <View key={index} style={styles.imgDesign}>
                <Image source={{uri: i}} style={styles.imgStyles} />
              </View>
            ))}
          </View>

          <Divider />
          <View style={{marginVertical: RFValue(20)}}>
            {confirmUserStatus && (
              <TextRow heading={t('yourComment')} desc={confirmUserStatus} />
            )}
            {confirmUserImages.length > 0 && (
              <>
                <Text
                  style={{
                    paddingLeft: RFValue(10),
                    fontWeight: 'bold',
                  }}>
                  {t('yourImg')}:
                </Text>
                <View style={styles.gallery}>
                  {confirmUserImages.map(i => (
                    <View key={i.sc_images} style={styles.imgDesign}>
                      <Image
                        source={{uri: URL + i.sc_images}}
                        style={styles.imgStyles}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
          <Button
            mode="contained"
            uppercase={false}
            style={{
              width: '70%',
              alignSelf: 'center',
              borderRadius: RFValue(100),
            }}
            onPress={() =>
              navigation.navigate('serviceConfirmation', {
                booking_id: bookingId,
              })
            }
            disabled={confirmStatus !== 'PENDING'}>
            {t('serviceConf')}
          </Button>
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    padding: RFValue(12),
    backgroundColor: 'white',
  },
  marginVertical: {
    marginVertical: RFValue(5),
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: RFValue(10),
  },
  imgDesign: {
    width: RFValue(90),
    height: RFValue(90),
    marginRight: RFValue(10),
    marginBottom: RFValue(10),
    borderWidth: 1 / 2,
    borderColor: '#cacbcc',
  },
  imgStyles: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
export default JobDescription;
