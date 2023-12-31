import React, { useCallback, useEffect, useState,useRef } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import i18n from 'i18next';
import { Box, Button, FormControl, Input } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Loader } from '../../components/common/Loader';
import * as authActions from '../../store/actions/auth';
import * as addressActions from '../../store/actions/address';
import { SearchableDropdown } from '../../components/common/SearchableDropdown';
import Colors from '../../constants/Colors';
import { useError } from '../../hooks/useError';
import { GOOGLE_API_KEY } from '../../constants/base_url';
import MapView,{Marker} from 'react-native-maps';

const NewAddressScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [countryName, setCountryName] = useState('');
  const [cityName, setCityName] = useState('');
  const [lat, setLat] = useState('');
  const [long, setLong] = useState('');
  const [iOS2, setIOS2] = useState('');

  const mapRef = useRef(null);


  const dispatch = useDispatch();
  const setError = useError();
  const { countries, cities } = useSelector(state => state.auth);
  const { lang } = useSelector(state => state.lang);

  const setData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await dispatch(authActions.setCountries());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }, [dispatch, setError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setData);

    return unsubscribe;
  }, [navigation, setData]);

  const setCities = useCallback(async () => {
    if (country) {
      setCityLoading(true);
      setError(null);
      try {
        await dispatch(authActions.setCities(country));
      } catch (e) {
        setError(e.message);
      }
      setCityLoading(false);
    }
  }, [country, dispatch, setError]);

  useEffect(() => {
    if (lat && long) {
      mapRef.current?.animateCamera(
        {
          center: { latitude: lat, longitude: long },
          zoom: 16,
        },
        { duration: 1000 },
      );
    }
  }, [lat,long]);

  useEffect(() => {
    setCities().then(() => null);
  }, [setCities]);

  

  const addAddressHandler = useCallback(async () => {
    try {
      setSubmitLoading(true);
      setError(null);
      await dispatch(
        addressActions.setNewAddress(
          username,
          address,
          country,
          city,
          buildingName,
          phoneCode,
          phoneNumber,
          lat,
          long,
        ),
      );
      setSubmitLoading(false);
      alert('Success!');
      navigation.navigate('AddressBook');
    } catch (e) {
      setSubmitLoading(false);
      setError(e.message);
    }
  }, [
    username,
    setError,
    dispatch,
    address,
    country,
    city,
    buildingName,
    phoneCode,
    phoneNumber,
    lat,
    long,
    navigation,
  ]);

  const onSelectCountry = (id, text) => {
    setCountry(id);
    setCountryName(text);
    const a = countries.find(m => m.id === id);
    if (a) {
      setPhoneCode(a.phonecode);
      setIOS2(a.iso2);
    }
    setCity('');
  };

  const onSelectCity = (id, text) => {
    setCity(id);
    setCityName(text);
  };

  const autoCompleteOnPress = (data, details = null) => {
    setAddress(data.description);
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
            <View>
              <ActivityIndicator size={'small'} color={Colors.primary} />
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
              placeholder="Add Complete Address"
              minLength={2}
              onFail={error => console.error(error)}
              autoFocus={false}
              returnKeyType={'search'}
              keyboardAppearance={'light'}
              listViewDisplayed="auto"
              fetchDetails={true}
              renderDescription={row => row.description}
              onPress={autoCompleteOnPress}
              getDefaultValue={() => ''}
              query={{
                key: GOOGLE_API_KEY,
                language: lang,
                components: `country:${iOS2}`,
              }}
              styles={styles.mapMarker}
              debounce={200}
              textInputProps={{
                InputComp: Input,
                value: address,
                onChangeText: setAddress,
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
          <Box mt={2}>
            <MapView
              style={{ width: '100%', height: 170 }}
              region={{
                latitude: lat ? lat : 37.78825,
                longitude: long ? long : -122.4324,
                latitudeDelta: 0.006,
                longitudeDelta: 0.006,
              }}
              provider={'google'}
              mapType="standard"
            >
              <Marker coordinate={{
                latitude: lat ? lat : 37.78825,
                longitude: long ? long : -122.4324,
              }} />              
            </MapView>
          </Box>
          <Button
            mode={'solid'}
            color={Colors.primary}
            loading={submitLoading}
            disabled={submitLoading}
            onPress={addAddressHandler}
            style={{ marginTop: RFValue(30), width: '59%', alignSelf: 'center' }}>
            Add Address
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export const screenOptions = () => ({
  headerTitle: i18n.t('langChange:newAddress'),
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

export default NewAddressScreen;
