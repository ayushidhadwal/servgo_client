import {
  DELETE_ADDRESS,
  SET_ADDRESSES,
  SET_DEFAULT_ADDRESS,
  SET_NEW_ADDRESS,
  SET_SINGLE_ADDRESSES,
  UPDATE_ADDRESS,
} from '../actions/address';
import {Address} from '../../models/Address';

const initialState = {
  addresses: [],
  address: new Address('', '', '', '', '', '', '', '', '', '', '', '', ''),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ADDRESSES:
      return {
        ...state,
        addresses: action.addresses.map(
          address =>
            new Address(
              address.id.toString(),
              address.user_name,
              address.user_address,
              address.user_country,
              address.user_city,
              address.user_phone_code,
              address.user_phone_number,
              address.default_add,
              address.country_name,
              address.city_name,
              address.building_name,
              address.latitude,
              address.longitude,
            ),
        ),
      };
    case SET_DEFAULT_ADDRESS: {
      const addresses = [...state.addresses];

      const defaultAddress = addresses.findIndex(
        address => address.isDefault === true,
      );

      if (defaultAddress > -1) {
        addresses[defaultAddress].isDefault = false;
      }

      const index = addresses.findIndex(
        address => address.id === action.addressId,
      );

      if (index > -1) {
        addresses[index].isDefault = true;
      }

      return {
        ...state,
        addresses: addresses,
      };
    }
    case SET_SINGLE_ADDRESSES:
      return {
        ...state,
        address: action.address,
      };
    case UPDATE_ADDRESS: {
      const addresses = [...state.addresses];
      const index = addresses.findIndex(
        address => address.id === action.address.id,
      );
      if (index > -1) {
        addresses[index].name = action.address.name;
        addresses[index].address = action.address.address;
        addresses[index].phoneCode = action.address.phoneCode;
        addresses[index].phoneNumber = action.address.phoneNumber;
        addresses[index].buildingName = action.address.buildingName;
        addresses[index].lat = action.address.lat;
        addresses[index].long = action.address.long;
        addresses[index].country = action.address.country;
        addresses[index].city = action.address.city;
        addresses[index].countryName = action.address.countryName;
        addresses[index].cityName = action.address.cityName;
      }
      return {
        ...state,
        addresses: addresses,
      };
    }
    case SET_NEW_ADDRESS: {
      const addresses = [...state.addresses];
      addresses.push(action.address);
      return {
        ...state,
        addresses: addresses,
      };
    }
    case DELETE_ADDRESS: {
      const addresses = [...state.addresses];

      const index = addresses.findIndex(
        address => address.id === action.addressId,
      );
      if (index > -1) {
        if (addresses[index].isDefault) {
          const updateIndex = addresses.findIndex(a => !a.isDefault);
          if (updateIndex > -1) {
            addresses[updateIndex].isDefault = true;
          }
        }

        addresses.splice(index, 1);
      }

      return {
        ...state,
        addresses: addresses,
      };
    }
    default:
      return state;
  }
};
