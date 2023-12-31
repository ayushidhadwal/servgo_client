import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Box, FormControl, Input } from 'native-base';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import i18n from 'i18next';

import { useDispatch, useSelector } from 'react-redux';
import * as authActions from '../../store/actions/auth';
import * as addressActions from '../../store/actions/address';
import { SearchableDropdown } from '../../components/common/SearchableDropdown';
import { GOOGLE_API_KEY } from '../../constants/base_url';
import Colors from '../../constants/Colors';
import { useError } from '../../hooks/useError';
import { Loader } from '../../components/common/Loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapView, { Marker } from 'react-native-maps';

const EditAddressScreen = ({ route, navigation }) => {
  const { addressId } = route.params;
  const placesRef = useRef();

  const dispatch = useDispatch();
  const setError = useError();
  const { countries, cities } = useSelector(state => state.auth);
  const { lang } = useSelector(state => state.lang);
  const { address: editAddress } = useSelector(state => state.address);

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [completeAddress, setCompleteAddress] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [countryName, setCountryName] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [lat, setLat] = useState(37.78825);
  const [long, setLong] = useState(-122.4324);

  useEffect(() => {
    setUsername(editAddress.name);
    setCity(editAddress.city);
    setCountry(editAddress.country);
    setBuildingName(editAddress.buildingName);
    setPhoneCode(editAddress.phoneCode);
    setPhoneNumber(editAddress.phoneNumber);
    setCountryName(editAddress.countryName);
    setCityName(editAddress.cityName);
    setLat(Number(editAddress.lat));
    setLong(Number(editAddress.long));
    setCompleteAddress(editAddress.address);
  }, [editAddress]);

  useEffect(() => {
    placesRef.current?.setAddressText(editAddress?.address);
  }, [editAddress?.address]);

  const setData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(addressActions.setSingleAddress(addressId));
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [addressId, dispatch, setError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setData);

    return unsubscribe;
  }, [navigation, setData]);

  const setCities = useCallback(
    async countryId => {
      setCityLoading(true);
      setError(null);
      try {
        await dispatch(authActions.setCities(countryId));
      } catch (e) {
        setError(e.message);
      }
      setCityLoading(false);
    },
    [dispatch, setError],
  );

  useEffect(() => {
    if (country !== '') {
      setCities(country).then(() => null);
    }
  }, [country, setCities]);

  const _editAddressHandler = useCallback(async () => {
    try {
      setSubmitLoading(true);
      setError(null);
      await dispatch(
        addressActions.updateAddress(
          username,
          addressId,
          completeAddress,
          country,
          city,
          buildingName,
          phoneCode,
          phoneNumber,
          lat,
          long,
          editAddress.isDefault,
        ),
      );
      Alert.alert('Alert', 'Address Updated Successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setError(e.message);
    }

    setSubmitLoading(false);
  }, [
    username,
    setError,
    dispatch,
    addressId,
    completeAddress,
    country,
    city,
    buildingName,
    phoneCode,
    phoneNumber,
    lat,
    long,
    editAddress.isDefault,
    navigation,
  ]);

  const onSelectCountry = (id, text) => {
    setCountry(id);
    setCountryName(text);
    const a = countries.find(m => m.id === id);
    if (a) {
      setPhoneCode(a.phonecode);
    }
    setCity('');
  };

  const onSelectCity = (id, text) => {
    setCity(id);
    setCityName(text);
  };

  const autoCompleteOnPress = (data, details = null) => {
    setCompleteAddress(data.description);
    setLat(details.geometry.location.lat);
    setLong(details.geometry.location.lng);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <View style={styles.screen}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        <View style={styles.form}>
          <FormControl w={'95%'} alignSelf={'center'} isInvalid={false} mb={2}>
            <FormControl.Label>Name</FormControl.Label>
            <Input
              variant="underlined"
              size={'lg'}
              value={username}
              onChangeText={setUsername}
              InputLeftElement={
                <AntDesign
                  name="idcard"
                  size={24}
                  color={Colors.primary}
                  style={{ marginRight: 8 }}
                />
              }
            />
          </FormControl>
          <SearchableDropdown
            dataSource={countries.map(m => ({
              name: m.name,
              id: m.id,
            }))}
            selectedId={country}
            selectedName={countryName}
            updateVal={onSelectCountry}
            label={'Country'}
            icon={'earth'}
            placeholder={'Search Country'}
          />
          {cityLoading ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 10,
              }}>
              <ActivityIndicator size={'small'} color={Colors.primary} />
              <Text>Loading...</Text>
            </View>
          ) : (
            <SearchableDropdown
              isDisabled={!country}
              dataSource={cities.map(m => ({
                name: m.name,
                id: m.id,
              }))}
              selectedId={city}
              selectedName={cityName}
              updateVal={onSelectCity}
              label={'City'}
              error={'Please Select Country'}
              icon={'md-location'}
              placeholder={'Search City'}
            />
          )}
          <FormControl
            w={'100%'}
            isDisabled={!country || !city}
            alignSelf={'center'}
            isInvalid={false}
            mb={2}>
            <FormControl.Label ml={3}>Address</FormControl.Label>
            <GooglePlacesAutocomplete
              ref={placesRef}
              placeholder="Add Complete Address"
              minLength={2}
              autoFocus={false}
              returnKeyType={'search'}
              keyboardAppearance={'light'}
              listViewDisplayed="auto"
              fetchDetails={true}
              renderDescription={row => row.description}
              onPress={autoCompleteOnPress}
              query={{
                key: GOOGLE_API_KEY,
                language: lang,
              }}
              styles={styles.mapMarker}
              debounce={200}
              textInputProps={{
                InputComp: Input,
                variant: 'underlined',
                colorScheme: '#226ea0',
                w: '100%',
                InputLeftElement: (
                  <Entypo
                    name="location"
                    size={24}
                    color={Colors.primary}
                    style={{ marginRight: 8 }}
                  />
                ),
              }}
            />
          </FormControl>
          <FormControl w={'95%'} alignSelf={'center'} isInvalid={false} mb={2}>
            <FormControl.Label>Building Name</FormControl.Label>
            <Input
              variant="underlined"
              size={'lg'}
              value={buildingName}
              onChangeText={setBuildingName}
              InputLeftElement={
                <MaterialCommunityIcons
                  name="office-building-marker"
                  size={24}
                  color={Colors.primary}
                  style={{ marginRight: 8 }}
                />
              }
            />
          </FormControl>
          <Box
            alignItems={'center'}
            alignSelf={'center'}
            w={'93%'}
            flexDirection={'row'}
            justifyContent={'space-between'}>
            <FormControl
              w={'30%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>Code</FormControl.Label>
              <Input
                isDisabled
                variant="underlined"
                size={'lg'}
                value={phoneCode}
                keyboardType="number-pad"
                onChangeText={setPhoneNumber}
                InputLeftElement={
                  <MaterialCommunityIcons
                    name="phone"
                    size={24}
                    color={Colors.primary}
                    style={{ marginRight: 8 }}
                  />
                }
              />
            </FormControl>
            <FormControl
              w={'65%'}
              alignSelf={'center'}
              isInvalid={false}
              mb={2}>
              <FormControl.Label>{i18n.t('langChange:mob')}</FormControl.Label>
              <Input
                variant="underlined"
                size={'lg'}
                value={phoneNumber}
                keyboardType="number-pad"
                onChangeText={setPhoneNumber}
              />
            </FormControl>
          </Box>
          {lat && long ?
            <Box mt={2}>

              <MapView
                style={{ width: '100%', height: 170 }}
                region={{
                  latitude: lat,
                  longitude: long,
                  latitudeDelta: 0.006,
                  longitudeDelta: 0.006,
                }}
                provider={'google'}
                mapType="standard"
              >


                <Marker coordinate={{
                  latitude: lat,
                  longitude: long,
                }} />

              </MapView>
            </Box>
            : null}
          <Button
            mode={'outlined'}
            color={Colors.primary}
            onPress={_editAddressHandler}
            loading={submitLoading}
            disabled={submitLoading}
            style={{ marginTop: RFValue(30), width: '35%', alignSelf: 'center' }}>
            Update
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const screenOptions = () => ({
  headerTitle: i18n.t('langChange:editAddress'),
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  form: {
    margin: RFValue(12),
  },
  input: {
    backgroundColor: 'transparent',
    marginBottom: RFValue(12),
  },
  mapMarker: {
    textInputContainer: {
      width: '93%',
      alignSelf: 'center',
    },
    textInput: {
      height: 60,
      color: Colors.black,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
});

export default EditAddressScreen;
