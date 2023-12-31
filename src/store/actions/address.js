import axios from 'axios';
import {Address} from '../../models/Address';

export const SET_ADDRESSES = 'SET_ADDRESSES';
export const SET_SINGLE_ADDRESSES = 'SET_SINGLE_ADDRESSES';
export const SET_DEFAULT_ADDRESS = 'SET_DEFAULT_ADDRESS';
export const UPDATE_ADDRESS = 'UPDATE_ADDRESS';
export const SET_NEW_ADDRESS = 'SET_NEW_ADDRESS';
export const DELETE_ADDRESS = 'DELETE_ADDRESS';

export const setAddresses = () => {
  return async dispatch => {
    const response = await axios.get('user/get-all-address');
    if (response.data.status) {
      dispatch({type: SET_ADDRESSES, addresses: response.data.data.address});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const setSingleAddress = addressId => {
  return async dispatch => {
    const response = await axios.get(`user/get-address-details/${addressId}`);

    if (response.data.status) {
      const {
        id,
        user_name,
        user_address,
        user_country,
        user_city,
        user_phone_code,
        user_phone_number,
        default_add,
        country_name,
        city_name,
        building_name,
        latitude,
        longitude,
      } = response.data.data.address;
      dispatch({
        type: SET_SINGLE_ADDRESSES,
        address: new Address(
          id,
          user_name,
          user_address,
          user_country,
          user_city,
          user_phone_code,
          user_phone_number,
          default_add,
          country_name,
          city_name,
          building_name,
          latitude,
          longitude,
        ),
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const setDefaultAddress = addressId => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('address_id', addressId);

    const response = await axios.post('user/set-default-address', formData);

    if (response.data.status) {
      dispatch({
        type: SET_DEFAULT_ADDRESS,
        addressId,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const updateAddress = (
  username,
  addressId,
  address,
  country,
  city,
  buildingName,
  phoneCode,
  phoneNumber,
  lat,
  long,
  isDefault,
) => {
  return async (dispatch, getState) => {
    const {countries, cities} = getState().auth;

    if (!username) {
      throw new Error('Name is required!');
    }
    if (!address) {
      throw new Error('Address is required!');
    }
    if (!country) {
      throw new Error('Country is required!');
    }
    if (!city) {
      throw new Error('City is required!');
    }
    if (!buildingName) {
      throw new Error('Building Name is required!');
    }
    if (!phoneNumber) {
      throw new Error('Phone Number is required!');
    }

    const formData = new FormData();
    formData.append('address', address);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('user_name', username);
    formData.append('phone_code', phoneCode);
    formData.append('phone_number', phoneNumber);
    formData.append('address_id', addressId);
    formData.append('lat', lat);
    formData.append('long', long);
    formData.append('building_name', buildingName);

    const response = await axios.post('user/update-address', formData);

    if (response.data.status) {
      const countryName = countries.find(c => Number(c.id) === Number(country));
      const cityName = cities.find(c => Number(c.id) === Number(city));

      dispatch({
        type: UPDATE_ADDRESS,
        address: new Address(
          addressId,
          'lovely',
          address,
          country,
          city,
          phoneCode,
          phoneNumber,
          isDefault,
          countryName.name, // countryName
          cityName.name, // cityName
          buildingName,
          lat,
          long,
        ),
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const setNewAddress = (
  username,
  address,
  country,
  city,
  buildingName,
  phoneCode,
  phoneNumber,
  lat,
  long,
) => {
  return async (dispatch, getState) => {
    const {countries, cities} = getState().auth;
    if (!username) {
      throw new Error('Name is required!');
    }
    if (!address) {
      throw new Error('Address is required!');
    }
    if (!country) {
      throw new Error('Country is required!');
    }
    if (!city) {
      throw new Error('City is required!');
    }
    if (!buildingName) {
      throw new Error('Name is required!');
    }
    if (!phoneNumber) {
      throw new Error('Phone Number is required!');
    }

    const formData = new FormData();
    formData.append('address', address);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('user_name', username);
    formData.append('phone_code', phoneCode);
    formData.append('phone_number', phoneNumber);
    formData.append('lat', lat);
    formData.append('long', long);
    formData.append('building_name', buildingName);

    console.log(formData)
    const response = await axios.post('user/add-address', formData);

    if (response.data.status) {
      const countryName = countries.find(c => Number(c.id) === Number(country));
      const cityName = cities.find(c => Number(c.id) === Number(city));


      dispatch({
        type: SET_NEW_ADDRESS,
        address: new Address(
          response.data.data.id,
          response.data.data.user_name,
          address,
          country,
          city,
          phoneCode,
          phoneNumber,
          response.data.data.default_add,
          countryName.name, // countryName
          cityName.name, // cityName
          response.data.data.building_name,
          lat,
          long,
        ),
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const deleteAddress = addressId => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('address_id', addressId);

    const response = await axios.post('user/delete-address', formData);

    if (response.data.status) {
      dispatch({
        type: DELETE_ADDRESS,
        addressId: addressId,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};
