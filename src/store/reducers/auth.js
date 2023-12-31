import {
  LOGIN,
  SET_COUNTRIES,
  SET_CITIES,
  FORGOT_PASSWORD,
  VERIFY_OTP,
  REGISTER,
} from '../actions/auth';

const initialState = {
  countries: [],
  cities: [],
  register: {
    isVerified: false,
    mobileNumber: null,
  },
  auth: {
    userId: null,
    accessToken: null,
    tokenType: null,
  },

  user_id: null,
  email: '',
  otp: 0,
  token: '',
  rUser_id: '',
  lat: 0,
  lang: 0,
  accessToken: '',
  tokenType: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REGISTER: {
      const {isVerified, mobileNumber} = action.payload;

      return {
        ...state,
        register: {
          isVerified: isVerified,
          mobileNumber: mobileNumber,
        },
      };
    }
    case LOGIN: {
      const {userId, accessToken, tokenType} = action.payload;

      return {
        ...state,
        register: {
          mobileNumber: null,
        },
        auth: {
          userId,
          accessToken,
          tokenType,
        },
      };
    }

    case FORGOT_PASSWORD: {
      return {
        ...state,
        email: action.email,
        otp: action.otp,
      };
    }
    case VERIFY_OTP: {
      return {
        ...state,
        token: action.token,
      };
    }

    case SET_COUNTRIES: {
      return {
        ...state,
        countries: [...action.countries],
      };
    }
    case SET_CITIES: {
      return {
        ...state,
        cities: [...action.cities],
      };
    }
    default:
      return state;
  }
};
