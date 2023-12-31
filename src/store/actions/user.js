import axios from 'axios';

export const UPDATE_PASSWORD = 'UPDATE_PASSWORD';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const GET_USER_PROFILE = 'GET_USER_PROFILE';
export const GET_WALLET_TRANSACTIONS = 'GET_WALLET_TRANSACTIONS';
export const SET_PROFILE_PIC = 'SET_PROFILE_PIC';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const GET_MESSAGE = 'GET_MESSAGE';
export const SEND_OTP_USER_EMAIL = 'SEND_OTP_USER_EMAIL';
export const SEND_OTP_USER_MOBILE = 'SEND_OTP_USER_MOBILE';
export const UPDATE_USER_MOBILE = 'UPDATE_USER_MOBILE';
export const UPDATE_USER_EMAIL = 'UPDATE_USER_EMAIL';
export const DELETE_USER_ACCOUNT = 'DELETE_USER_ACCOUNT';

export const updatePassword = (
  user_id,
  old_password,
  password,
  password_confirmation,
) => {
  return async dispatch => {
    if (!old_password) {
      throw new Error('Old Password is required!');
    }
    if (!password) {
      throw new Error('Password is required!');
    }
    if (password.length < 5) {
      throw new Error(
        'The New Password field must be at least 6 characters in length.',
      );
    }
    if (!password_confirmation) {
      throw new Error('Confirm Password is required!');
    }
    if (password !== password_confirmation) {
      throw new Error('Passwords must be same.!');
    }
    const formData = new FormData();
    formData.append('old_password', old_password);
    formData.append('password', password);
    formData.append('password_confirmation', password_confirmation);

    const response = await axios({
      method: 'post',
      url: 'user/update-password',
      data: formData,
    });

    if (response.data.status) {
      dispatch({type: UPDATE_PASSWORD});
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const updateProfile = (
  name,
  email,
  country,
  city,
  phoneNumber,
  phoneCode,
) => {
  return async dispatch => {
    if (!name) {
      throw new Error('Your name is required!');
    }
    if (!email) {
      throw new Error('Your Email is required!');
    }
    if (!phoneNumber) {
      throw new Error('Your Number is required!');
    }
    if (!country) {
      throw new Error('Please Choose your Country!');
    }
    if (!city) {
      throw new Error('Please Choose your City!');
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('country', country);
    formData.append('city', city);
    formData.append('email', email);
    formData.append('mobile', phoneNumber);
    formData.append('phone_code', phoneCode);

    const response = await axios.post('user/update-profile', formData);

    if (response.data.status) {
      dispatch({type: UPDATE_PROFILE});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_user_profile = () => {
  return async dispatch => {
    const response = await axios.get('user/get-profile');
    if (response.data.status) {
      dispatch({type: GET_USER_PROFILE, Profile: response.data.data});
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_wallet_transactions = () => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const response = await axios.get('user/get-wallet-transactions/' + userId);

    dispatch({
      type: GET_WALLET_TRANSACTIONS,
      TransactionList: response.data,
    });
  };
};

export const updatePicture = image => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('user_id', userId);
    if (image?.fileName) {
      form.append('image', {
        uri: image.uri,
        name: image.fileName,
        type: image.type,
      });
    }

    const response = await axios.post('user/update-profile-picture', form);

    if (!response.data.status) {
      throw new Error(response.data.msg);
    } else {
      dispatch({type: SET_PROFILE_PIC});
    }
  };
};

export const sendMessage = (bookingId, text) => {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('user_id', userId);
    form.append('booking_id', bookingId);
    form.append('message', text);

    const response = await axios.post('user/send-message', form);

    if (response.data.status) {
      dispatch({
        type: SEND_MESSAGE,
        input: text,
        bookingId: bookingId,
        senderId: userId,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export function getMessage(bookingId, partnerId) {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;

    const form = new FormData();
    form.append('user_id', userId);
    form.append('booking_id', bookingId);
    form.append('partner_id', partnerId);

    const response = await axios.post('user/get-messages', form);

    if (response.data.status) {
      dispatch({type: GET_MESSAGE, getChats: response.data.data});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function sendOTPEmail(email) {
  return async dispatch => {
    const form = new FormData();
    form.append('email', email);

    const response = await axios.post('user/send-email-with-otp', form);

    if (response.data.status) {
      dispatch({type: SEND_OTP_USER_EMAIL, emailOTP: response.data.data.OTP});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function sendOTPMobile(mobile, phoneCode) {
  return async dispatch => {
    const form = new FormData();
    form.append('mobile', mobile);
    form.append('phone_code', phoneCode);

    const response = await axios.post('user/send-mobile-otp', form);

    if (response.data.status) {
      dispatch({type: SEND_OTP_USER_MOBILE, mobileOTP: response.data.data.OTP});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function updateUserEmail(email, OTP) {
  return async dispatch => {
    const form = new FormData();
    form.append('email', email);
    form.append('otp', OTP);

    const response = await axios.post('user/verfy-email-otp', form);
    console.log(response.data);

    if (response.data.status) {
      dispatch({type: UPDATE_USER_EMAIL});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function updateUserMobile(mobile, OTP, phoneCode) {
  return async dispatch => {
    const form = new FormData();
    form.append('mobile', mobile);
    form.append('otp', OTP);
    form.append('phone_code', phoneCode);
    const response = await axios.post('user/veryfy-otp-mobile', form);

    console.log('response', response.data);

    if (response.data.status) {
      dispatch({type: UPDATE_USER_MOBILE});
    } else {
      throw new Error(response.data.message);
    }
  };
}

export function deleteUserAccount() {
  return async (dispatch, getState) => {
    const {
      auth: {userId},
    } = getState().auth;
    const form = new FormData();
    form.append('user_id', userId);
    const response = await axios.post('user/user-delete-account', form);

    if (response.data.status) {
      dispatch({type: DELETE_USER_ACCOUNT});
    } else {
      throw new Error(response.data.message);
    }
  };
}
