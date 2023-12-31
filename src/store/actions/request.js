import axios from 'axios';
import dayjs from 'dayjs';

export const GET_SERVICE_PROVIDER = 'GET_SERVICE_PROVIDER';
export const REQUEST_SERVICE = 'REQUEST_SERVICE';
export const GET_BOOKING = 'GET_BOOKING';
export const CANCEL_REQUEST = 'CANCEL_REQUEST';
export const POST_REVIEW = 'POST_REVIEW';
export const GET_SERVICE_PROVIDER_REVIEW = 'GET_SERVICE_PROVIDER_REVIEW';
export const GET_SERVICE_PROVIDER_PROFILE = 'GET_SERVICE_PROVIDER_PROFILE';
export const PAY_ORDER_DETAILS = 'PAY_ORDER_DETAILS';
export const PAY_FOR_ORDER = 'PAY_FOR_ORDER';
export const GET_COMPLETED_REQUEST = 'GET_COMPLETED_REQUEST';
export const RAISE_COMPLAINT = 'RAISE_COMPLAINT';
export const URGENT_SERVICES = 'URGENT_SERVICES';
export const RATE_US = 'RATE_US';
export const GET_PAYMENT_AMOUNT = 'GET_PAYMENT_AMOUNT';
export const RE_BOOKING = 'RE_BOOKING';
export const GET_BOOKING_DETAILS = 'GET_BOOKING_DETAILS';
export const PICTURES_OF_BOOKING = 'PICTURES_OF_BOOKING';
export const SET_SERVICE_CONFIRMATION = 'SET_SERVICE_CONFIRMATION';
export const GET_ORDER_DETAILS = 'GET_ORDER_DETAILS';
export const SERVICE_ADD_TO_CART = 'SERVICE_ADD_TO_CART';
export const GET_PARTNER_SERVICES = 'GET_PARTNER_SERVICES';
export const GET_SAME_BOOKING_LIST = 'GET_SAME_BOOKING_LIST';
export const GET_MULTIPLE_PAYMENT = 'GET_MULTIPLE_PAYMENT'


export const getServiceProviderList = ({
  service,
  subService,
  date,
  time,
  qty,
  addressId,
  childService,
}) => {
  return async (dispatch, getState) => {
    const { auth } = getState().auth;

    if (!date) {
      throw new Error('Date is required!');
    }

    if (time === null) {
      throw new Error('Please select time slot!');
    }

    if (!qty || Number(qty) <= 0) {
      throw new Error('Please select time slot!');
    }
    const formData = new FormData();
    formData.append('service', service);
    formData.append('sub_service', subService);
    formData.append('date', dayjs(date).format('YYYY-MM-DD'));
    formData.append('time', time);
    formData.append('user_id', auth.userId);
    formData.append('qty', Number(qty).toString());
    formData.append('address_id', addressId);
    formData.append('child_service', childService);

    console.log(formData);


    const response = await axios.post('main/get-service-provider', formData);

    console.log(response.data.data)

    if (response.data && response.data.result) {
      dispatch({
        type: GET_SERVICE_PROVIDER,
        serviceProvider: response?.data?.data?.service_provider,
        service: response?.data?.data?.service,
        subService: response?.data?.data?.subservice,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const request_service = (
  partner_id,
  service_id, // array
  booking_date,
  booking_time,
  service_price, // array
  qty, // array
  final_service_price,
  address_id,
  instructions,
) => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const serviceId = JSON.stringify(service_id);
    const q = JSON.stringify(qty);
    const price = JSON.stringify(service_price);

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('partner_id', partner_id.toString());
    formData.append('service_id', serviceId);
    formData.append('booking_date', booking_date);
    formData.append('booking_time', booking_time);
    formData.append('service_price', price);
    formData.append('qty', q);
    formData.append('final_service_price', final_service_price.toString());
    formData.append('address_id', address_id);
    formData.append('comment', instructions);

    const response = await axios.post('user/request-service', formData);

    if (response.data.status) {
      dispatch({
        type: REQUEST_SERVICE,
        bookingId: response.data.data.booking_id,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_partner_service = (service_id) => {
  return async (dispatch) => {
    const formData = new FormData()
    formData.append('service_id', service_id);


    const response = await axios.post('main/get-partner-service-fresh', formData);

    console.log(response.data.result)
    if (response.data.result) {

      dispatch({
        type: GET_PARTNER_SERVICES,
        partnerServices: response.data.service
      })
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const get_booking = () => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const formData = new FormData();
    formData.append('user_id', userId);

    const response = await axios.post('user/get-booking', formData);

    dispatch({ type: GET_BOOKING, bookingList: response.data.html });
  };
};



// booking list (services will be shown once if there are more than one service with same  booking id )
export const get_booking_list = () => {
  return async (dispatch, getState) => {
    const { auth: { userId } } = getState().auth;

    const formData = new FormData();
    formData.append('user_id', userId);

    const response = await axios.post('user/get-booking-id', formData);

    dispatch({ type: GET_SAME_BOOKING_LIST, sameBookingList: response.data.html })

  }
}

export const cancel_request = booking_id => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('booking_id', booking_id);

    const response = await axios.post('user/cancel-request', formData);

    if (response.data.status) {
      dispatch({ type: CANCEL_REQUEST, booking_id });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const post_review = (
  message,
  image,
  service,
  money,
  behaviour,
  partner_id,
  booking_id,
) => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    if (!message) {
      throw new Error('Message Field must be Filled.');
    }
    if (!service) {
      throw new Error('Please rate our services out of 5.');
    }
    if (!money) {
      throw new Error('Please rate value for money out of 5.');
    }
    if (!behaviour) {
      throw new Error('Please rate the behaviour out of 5. ');
    }
    if (service > 5 || money > 5 || behaviour > 5) {
      throw new Error('Ratings must be out of 5');
    }

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('message', message);
    formData.append('services', service);
    formData.append('value_for_money', money);
    formData.append('behaviour', behaviour);
    formData.append('partner_id', partner_id);
    formData.append('booking_id', booking_id);

    if (image?.uri) {
      formData.append('image', image);
    }

    const response = await axios.post('user/post-review', formData);

    if (response.data.result) {
      dispatch({ type: POST_REVIEW });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getServiceProviderReview = partner_id => {
  return async dispatch => {
    const response = await axios.get(
      'main/get-service-provider-review/' + partner_id,
    );

    dispatch({
      type: GET_SERVICE_PROVIDER_REVIEW,
      providerReview: response.data.data,
    });
  };
};

export const getServiceProviderProfile = (
  partnerId,
  bookingDate,
  bookingTime,
  qty,
  addressId,
  serviceId,
) => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('partner_id', partnerId);
    formData.append('date', bookingDate);
    formData.append('time', bookingTime);
    formData.append('qty', qty);
    formData.append('address_id', addressId);
    formData.append('service_id', serviceId);
    const response = await axios.post(
      'main/get-service-provider-profile',
      formData,
    );

    dispatch({
      type: GET_SERVICE_PROVIDER_PROFILE,
      providerProfile: response.data.data,
    });
  };
};

export const serviceAddToCart = (
  branchId,
  partnerId,
  addressId,
  bookingDate,
  bookingTime,
  vendorId,
  servicePrice,
  quantity,
  instructions,
  serviceId,
  childService
) => {
  return async dispatch => {
    const formData = new FormData();



    formData.append('branch_id', branchId);
    formData.append('service_id', serviceId);
    formData.append('partner_id', partnerId);
    formData.append('address_id', addressId);
    formData.append('child_service_id', childService);
    formData.append('date', bookingDate);
    formData.append('time', bookingTime);
    formData.append('vsid[]', vendorId);
    formData.append('vsprice[]', servicePrice);
    formData.append('qty', quantity);
    formData.append('comment', instructions);
    console.log(formData)

    const response = await axios.post('user/service-add-to-cart', formData);
    // console.log(response.data)

    if (response.data.status) {
      dispatch({
        type: SERVICE_ADD_TO_CART,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const setPayOrderDetails = bookingId => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('booking_id', bookingId);
    const response = await axios.post('user/pay-order-detail', formData);

    dispatch({
      type: PAY_ORDER_DETAILS,
      payOrderDetails: response.data.data,
    });
  };
};

export const pay_for_order = (
  bookingId,
  refundWalletCheck,
  walletCheck,
  paymentMethod = 'online',
) => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const { paymentAmountDetails } = getState().request;

    const formData = new FormData();

    formData.append('pay_amount', paymentAmountDetails.card_pay);
    formData.append('wallet_check', walletCheck);
    formData.append('pay_from_wallet', paymentAmountDetails.points_pay);
    formData.append('refund_wallet_check', refundWalletCheck);
    formData.append('pay_from_refund_wallet', paymentAmountDetails.wallet_pay);
    formData.append('booking_id', bookingId);
    formData.append('total_amount', paymentAmountDetails.total_amount);
    formData.append('vat_amount', paymentAmountDetails.vat);
    formData.append('user_id', userId);
    formData.append('payment_method', paymentMethod);

    const response = await axios.post('user/payForOrder', formData);

    if (response.data.status) {
      dispatch({ type: PAY_FOR_ORDER });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getCompletedRequest = () => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const formData = new FormData();
    formData.append('user_id', userId);

    const response = await axios.post('user/get-completed-request', formData);

    dispatch({
      type: GET_COMPLETED_REQUEST,
      completedRequest: response.data.html,
    });
  };
};

export const raise_complaint = (partner_id, booking_id, subject, comment) => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('partner_id', partner_id);
    formData.append('booking_id', booking_id);
    formData.append('subject', subject);
    formData.append('comment', comment);

    const response = await axios.post('user/raise-complaint', formData);

    if (response.data.status) {
      dispatch({ type: RAISE_COMPLAINT });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const rate_us = (service, message) => {
  return async (dispatch, getState) => {
    if (service === 0) {
      throw new Error('Rating is required!');
    }

    const { user_id } = getState().auth;

    const form = new FormData();
    form.append('user_id', user_id);
    form.append('rating', service);
    form.append('comment', message);

    const response = await axios.post('user/rate-us', form);

    if (response.data.status) {
      dispatch({ type: RATE_US });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const urgentServices = (image, comment) => {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const form = new FormData();
    form.append('user_id', userId);
    form.append('description', comment);
    form.append('user_type', 'USER');
    if (image?.uri) {
      form.append('file', image);
    }

    const response = await axios.post('user/urgent-services', form);

    if (response.data.status) {
      dispatch({ type: URGENT_SERVICES });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export const getPaymentAmount = (
  bookingId,
  total,
  refundWalletChecked,
  walletChecked,
) => {
  return async dispatch => {
    const form = new FormData();
    form.append('booking_id', bookingId);
    form.append('total_price', total);
    form.append('check_refund_wallet', refundWalletChecked ? 'yes' : '');
    form.append('check_wallet', walletChecked ? 'yes' : '');

    console.log(form)

    const response = await axios.post('user/get-payment-amount', form);
    console.log(response.data)
    if (response.data.status) {
      dispatch({
        type: GET_PAYMENT_AMOUNT,
        // gatewayData: response.data.data,
        // bookingId,
        paymentAmountDetails: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};
export const getMultiplePaymentAmount = (
  bookingId,
  total,
  // refundWalletChecked,
  // walletChecked,
  childServices
) => {
  return async dispatch => {
    const form = new FormData();
    form.append('booking_id', bookingId);
    form.append('total_price', total);
    form.append('check_refund_wallet', '');
    form.append('check_wallet', '');

    childServices.forEach((id, index) => {
      formData.append(`child_id[${index}]`, id);
    });

    console.log(form)

    const response = await axios.post('user/get-multiple-payment-amount', form);
    
    console.log(response.data)
    if (response.data.status) {
      dispatch({
        type: GET_MULTIPLE_PAYMENT,
        // gatewayData: response.data.data,
        // bookingId,
        multiplePaymentDetails: response.data.data,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};

export function rescheduleBooking(booking_id, partnerId, booking_date, time) {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const form = new FormData();

    form.append('user_id', userId);
    form.append('partner_id', partnerId);
    form.append('booking_id', booking_id);
    form.append('booking_date', booking_date);
    form.append('booking_time', time);

    const response = await axios.post('user/rescheduling-service', form);

    if (response.data.status) {
      dispatch({ type: RE_BOOKING });
    } else {
      throw new Error(response.data.msg);
    }
  };
}
export function getCompleteServicePictures(booking_id) {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const form = new FormData();
    form.append('user_id', userId);
    form.append('booking_id', booking_id);

    const response = await axios.post(
      'user/get-complete-booking-pictures',
      form,
    );

    if (response.data.status) {
      dispatch({ type: PICTURES_OF_BOOKING, pictures: response.data.data });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function setServiceConfirmation(booking_Id, checked, reason, img) {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const form = new FormData();
    form.append('user_id', userId);
    form.append('service_confirmation', checked);
    form.append('booking_id', booking_Id);
    form.append('reason', reason);

    img.forEach((i, c) => {
      form.append(`image[${c}]`, i);
    });

    const response = await axios.post('user/service-confirmation', form);

    if (response.data.status) {
      dispatch({ type: SET_SERVICE_CONFIRMATION });
    } else {
      throw new Error(response.data.msg);
    }
  };
}

export function getOrderDetails(booking_id, service_id, child_service_id) {
  return async (dispatch, getState) => {
    const {
      auth: { userId },
    } = getState().auth;
    const form = new FormData();
    form.append('user_id', userId);
    form.append('booking_id', booking_id);
    form.append('service_id', service_id);
    form.append('child_service_id', child_service_id);
    console.log(form);

    const response = await axios.post('user/get-booking-details', form);

    if (response.data.status) {
      dispatch({ type: GET_ORDER_DETAILS, serviceOrdered: response.data.data });
    } else {
      throw new Error(response.data.msg);
    }
  };
}
