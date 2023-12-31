import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {BASE_URL} from '../../constants/base_url';
import {getNotificationToken} from '../../lib/notifee';

export const SESSION_ID = '@ServGo:userId';

export const REGISTER = 'REGISTER';
export const RESEND_OTP = 'RESEND_OTP';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const SET_COUNTRIES = 'SET_COUNTRIES';
export const SET_CITIES = 'SET_CITIES';
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD';
export const VERIFY_OTP = 'VERIFY_OTP';
export const SET_NEW_PASSWORD = 'SET_NEW_PASSWORD';
export const SET_LOCATION = 'SET_LOCATION';
export const SET_IP_ADDRESS = 'SET_IP_ADDRESS';
export const GET_COUNTRY = 'GET_COUNTRY';

export const auth = ({userId, accessToken, tokenType}) => {
  return {
    type: LOGIN,
    payload: {
      userId: userId,
      accessToken: accessToken,
      tokenType: tokenType,
    },
  };
};

export const logout = () => {
  return async dispatch => {
    await AsyncStorage.removeItem(SESSION_ID);
    dispatch({type: LOGOUT});
  };
};

export const setUserIp = () => {
  return async dispatch => {
    const result = await fetch('https://api.ipify.org/?format=json');
    const ipResult = await result.json();
    const ipAddress = ipResult?.ip;
    console.log({ipAddress});

    const formData = new FormData();
    formData.append('ip', ipAddress);

    const res = await fetch(`${BASE_URL}main/get-country-by-ip`, {
      method: 'POST',
      body: formData,
    });

    const resData = await res.json();

    if (resData.status) {
      dispatch({
        type: SET_IP_ADDRESS,
      });
    } else {
      throw new Error(resData.message);
    }
  };
};

export const login = (email, password) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    if (!password) {
      throw new Error('Password is required!');
    }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('token', token);

    const response = await axios.post('user/login', formData);

    if (response.data.status) {
      const {
        mobile_verified: isVerified,
        user_id: userId,
        access_token: accessToken,
        token_type: tokenType,
        mobile: mobileNumber,
      } = response.data.data;

      if (isVerified === 'Yes') {
        const data = {userId, accessToken, tokenType};

        await saveToStorage(data);
        dispatch(auth(data));
      } else {
        dispatch({
          type: REGISTER,
          payload: {
            isVerified: isVerified === 'Yes',
            mobileNumber,
          },
        });
      }
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const register = ({
  name,
  email,
  password,
  confirmPassword,
  phoneCode,
  mobile,
  countryCode,
  cityCode,
  referral,
}) => {
  return async dispatch => {
    if (!name) {
      throw new Error('Your name is required!');
    }

    if (!email) {
      throw new Error('Email is required!');
    }

    if (!password) {
      throw new Error('Password is required!');
    }

    if (!confirmPassword) {
      throw new Error('Confirm Password is required!');
    }

    if (!phoneCode) {
      throw new Error('Phone Code is required!');
    }

    if (!countryCode) {
      throw new Error('Country is required!');
    }
    if (!cityCode) {
      throw new Error('City is required!');
    }
    if (password !== confirmPassword) {
      throw new Error('Passwords must be same!');
    }

    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
    formData.append('phone_code', phoneCode);
    formData.append('mobile', mobile);
    formData.append('country', countryCode);
    formData.append('city', cityCode);
    formData.append('code', referral);
    formData.append('token', token);

    const response = await axios.post('user/register', formData);

    if (response.data.status) {
      const {mobile: mobileNumber} = response.data.data;
      console.log(response.data.data);

      dispatch({
        type: REGISTER,
        payload: {
          isVerified: false,
          mobileNumber: mobileNumber,
        },
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const setCountries = () => {
  return async dispatch => {
    const response = await axios.get('main/get-countries');
    dispatch({type: SET_COUNTRIES, countries: response.data.data});
  };
};

export const setCities = countryId => {
  return async dispatch => {
    const response = await axios.get(`main/get-cities/${countryId}`);
    dispatch({type: SET_CITIES, cities: response.data.data});
  };
};

export const forgotPassword = ({email}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await axios.post('user/send-otp', formData);
    console.log(response.data.otp);
    if (response.data.result) {
      dispatch({
        type: FORGOT_PASSWORD,
        email: response.data.email,
        otp: response.data.otp,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const resendRegistrationEmailOtp = email => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }

    const formData = new FormData();
    formData.append('email', email);

    const response = await axios.post('user/send-otp-again', formData);

    if (response.data.result) {
      const {
        otp,
        email: email_,
        mobile,
        mobile_verified,
        email_verified,
      } = response.data.data;

      dispatch({
        type: REGISTER,
        register: {
          mobileVerified: mobile_verified.toUpperCase() !== 'NO',
          emailVerified: email_verified.toUpperCase() !== 'NO',
          emailOTP: otp,
          mobileNumber: mobile,
          email: email_,
        },
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const resendRegistrationMobileOtp = mobile => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);

    const response = await axios.post('user/send-mobile-otp-again', formData);

    console.log('response', response.data);

    if (response.data) {
      dispatch({type: RESEND_OTP});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const verifyUserMobile = (mobile, otp) => {
  return async dispatch => {
    if (!mobile) {
      throw new Error('Mobile Number is required!');
    }

    if (!otp) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('otp', otp);
    const response = await axios.post(
      'user/verify-mobile-user-registration',
      formData,
    );

    if (response.data.status) {
      const {
        user_id: userId,
        access_token: accessToken,
        token_type: tokenType,
      } = response.data.data;

      const data = {userId, accessToken, tokenType};

      await saveToStorage(data);
      dispatch(auth(data));
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const verifyOtp = ({email, userOTP}) => {
  return async dispatch => {
    if (!email) {
      throw new Error('Email is required!');
    }
    if (!userOTP) {
      throw new Error('OTP is required!');
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('otp', userOTP);

    const response = await axios.post('user/verify-otp', formData);

    if (response.data.result) {
      dispatch({
        type: VERIFY_OTP,
        token: response.data.token,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const set_new_password = ({token, password, password_confirmation}) => {
  return async dispatch => {
    if (password.length < 6) {
      throw new Error('Password must contain 6 letters');
    }
    if (!password || !password_confirmation) {
      throw new Error('Fields must be filled!');
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.');
    }

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const response = await axios.post('user/forgot-password-update', formData);

    if (response.data.status) {
      dispatch({
        type: SET_NEW_PASSWORD,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const socialAuth = (type, uid, name, email) => {
  return async dispatch => {
    const token = await getNotificationToken();

    const formData = new FormData();
    formData.append('type', type);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('uid', uid);
    formData.append('token', token);

    const response = await axios.post('user/login-with-social', formData);

    if (response.data.status) {
      const {
        user_id: userId,
        access_token: accessToken,
        token_type: tokenType,
      } = response.data.data;

      const data = {userId, accessToken, tokenType};

      await saveToStorage(data);
      dispatch(auth(data));
    } else {
      throw new Error(response.data.message);
    }
  };
};

const saveToStorage = async data => {
  await AsyncStorage.setItem(SESSION_ID, JSON.stringify(data));
};
