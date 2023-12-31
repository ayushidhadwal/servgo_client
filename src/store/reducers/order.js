import {GET_ORDER_LIST, GET_PRODUCTS_ORDER_DETAILS} from '../actions/order';

const initialState = {
  OrderList: [],
  orderDetails: {
    id: null,
    orderId: '',
    paymentStatus: '',
    status: '',
    addrName: '',
    addrAddress: '',
    addrCountry: '',
    addrCity: '',
    addrPhoneNumber: '',
    createdAt: '',
    transactionId: '',
    totalPrice: '',
    pricePaid: '',
    vatAmount: '',
    walletPay: '',
    deliveryCharges: '',
    deliveryAgent: null,
    walletRefund: '',
    DeliveryBoyName: null,
    DeliveryBoyNumber: null,
    sellerName: '',
    sellerAddress: '',
    currency: '',
    OrderItem: [],
  },
};
export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER_LIST: {
      return {
        ...state,
        OrderList: [...action.OrderList],
      };
    }
    case GET_PRODUCTS_ORDER_DETAILS: {
      const data = action.orderDetails;
      return {
        ...state,
        orderDetails: {
          ...state.orderDetails,
          id: data.id,
          orderId: data.orderId,
          paymentStatus: data.payment_status,
          status: data.status,
          addrName: data.addr_name,
          addrAddress: data.addr_address,
          addrCountry: data.addr_country,
          addrCity: data.addr_city,
          addrPhoneNumber: data.addr_phonenumber,
          createdAt: data.created_at,
          transactionId: data.transaction_id,
          totalPrice: data.total_price,
          pricePaid: data.price_paid,
          vatAmount: data.vat_amount,
          walletPay: data.wallet_pay,
          deliveryCharges: data.delivery_charges,
          deliveryAgent: data.delivery_agent,
          walletRefund: data.wallet_refund,
          DeliveryBoyName: data.DeliveryBoyName,
          DeliveryBoyNumber: data.DeliveryBoyNumber,
          sellerName: data.sellerName,
          sellerAddress: data.sellerAddress,
          currency: data.currency,
          OrderItem: [...data.OrderItem],
        },
      };
    }
    default:
      return state;
  }
};
