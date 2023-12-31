import axios from 'axios';

export const GET_CART_LIST = 'GET_CART_LIST';
export const DELETE_CART = 'DELETE_CART';
export const ORDER_SUMMARY = 'ORDER_SUMMARY';
export const CHECKOUT = 'CHECKOUT';
export const CHECKOUT_SERVICE = 'CHECKOUT_SERVICE';
export const PRODUCT_PAYMENT = 'PRODUCT_PAYMENT';

export const getCartList = () => {
  return async dispatch => {
    const response = await axios.get('user/get-cart-list');
    console.log(response.data)

    if (response.data.status) {
      dispatch({
        type: GET_CART_LIST,
        ProductCartList: response.data.Data.productData,
        ServiceCartList: response.data.Data.serviceData,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const deleteCart = (cartId, itemType) => {
  return async dispatch => {
    const response = await axios.get(`user/delete-cart/${cartId}`);

    if (response.data.status) {
      dispatch({
        type: DELETE_CART,
        cartId: cartId,
        itemType: itemType,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const getOrderSummary = () => {
  return async dispatch => {
    const response = await axios.get('user/order-summary');

    console.log(response.data);

    if (response.data.status) {
      dispatch({
        type: ORDER_SUMMARY,
        OrderSummary: response.data.Data,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const checkout = (address, wallet, refundWallet, deliveryType) => {
  return async dispatch => {
   

    const formData = new FormData();
    formData.append('address', address);
    formData.append('check_wallet', wallet.length > 0 ? 'on' : 'off');
    formData.append('orderType', deliveryType);
    formData.append(
      'pay_from_refund_wallet',
      refundWallet.length > 0 ? 'on' : 'off',
    );
    console.log(formData)

    const response = await axios.post('user/checkout', formData);

    if (response.data.status) {
      dispatch({
        type: response.data?.Data ? CHECKOUT : CHECKOUT_SERVICE,
        checkoutData: response.data.Data,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const productPayment = (refundWalletCheck, walletCheck) => {
  return async (dispatch, getState) => {
    const {checkoutData} = getState().cart;

    const formData = new FormData();
    formData.append('total_amount', checkoutData.totalAmount);
    formData.append('wallet_check', walletCheck);
    formData.append('pay_from_wallet', checkoutData.pointsPay);
    formData.append('refund_wallet_check', refundWalletCheck);
    formData.append('pay_from_refund_wallet', checkoutData.walletPay);
    formData.append('payment_method', 'online');
    formData.append('pay_amount', checkoutData.cardPay);
    formData.append('vat_amount', checkoutData.vat);
    formData.append('card_pay', checkoutData.cardPay);
    formData.append('currency', checkoutData.currency);
    formData.append('user_address', checkoutData.address.id);
    formData.append('orderType', checkoutData.orderType);
    formData.append('deliveryCharges', checkoutData.deliveryCharges);

    const response = await axios.post('user/pay-for-product-booking', formData);

    if (response.data.status) {
      dispatch({
        type: PRODUCT_PAYMENT,
      });
    } else {
      throw new Error(response.data.msg);
    }
  };
};