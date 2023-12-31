import axios from 'axios';

export const GET_ORDER_LIST = 'GET_ORDER_LIST';
export const GET_PRODUCTS_ORDER_DETAILS = 'GET_PRODUCTS_ORDER_DETAILS';

export const getOrderList = () => {
  return async dispatch => {
    const response = await axios.get('user/order-list');

    if (response.data.status) {
      dispatch({
        type: GET_ORDER_LIST,
        OrderList: response.data.Data,
      });
    } else {
      dispatch({
        type: GET_ORDER_LIST,
        OrderList: [],
      });
      throw new Error(response.data.message);
    }
  };
};

export const getOrderDetails = id => {
  return async dispatch => {
    const response = await axios.get(`user/get-order-details/${id}`);

    if (response.data.status) {
      dispatch({
        type: GET_PRODUCTS_ORDER_DETAILS,
        orderDetails: response.data.Data,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};
