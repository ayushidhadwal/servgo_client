import {
  GET_CART_LIST,
  DELETE_CART,
  ORDER_SUMMARY,
  CHECKOUT,
} from '../actions/cart';

const initialState = {
  cart: [],
  ProductCartList: [],
  ServiceCartList: [],
  itemType: '',
  cartId: null,
  OrderSummary: {
    currency: '',
    product: [],
    service: [],
    vatPercent: '',
    wallet: '',
    walletPercent: '',
    walletRefund: '',
  },
  checkoutData: {
    orderType: '',
    pointWallet: '',
    refundWallet: '',
    totalPrice: 0,
    pointsPay: '',
    walletPay: 0,
    cardPay: 0,
    serviceDetails: [],
    product: [],
    vat: '',
    vatPercent: '',
    walletPercent: '',
    paymentType: '',
    totalAmount: 0,
    cvwrAmount: 0,
    currency: '',
    address: {
      id: 0,
      user_id: 0,
      user_name: '',
      user_address: '',
      building_name: '',
      user_country: 0,
      user_city: 0,
      user_phone_code: '',
      user_phone_number: '',
      default_add: '',
      latitude: '',
      longitude: '',
      created_at: '',
      updated_at: '',
      city_name: '',
      country_name: '',
    },
    deliveryCharges: 0,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_LIST: {
      return {
        ...state,
        ProductCartList: [...action.ProductCartList],
        ServiceCartList: [...action.ServiceCartList],
      };
    }
    case DELETE_CART: {
      const ProductCartList = [...state.ProductCartList];
      const ServiceCartList = [...state.ServiceCartList];

      const cartId = action.cartId;
      const itemType = action.itemType;

      if (itemType === 'product') {
        const index = ProductCartList.findIndex(c => c.id === cartId);
        if (index > -1) {
          ProductCartList.splice(index, 1);
        }
      } else {
        const index = ServiceCartList.findIndex(c => c.id === cartId);
        if (index > -1) {
          ServiceCartList.splice(index, 1);
        }
      }
      return {
        ...state,
        ProductCartList: ProductCartList,
        ServiceCartList: ServiceCartList,
      };
    }
    case ORDER_SUMMARY: {
      const data = action.OrderSummary;
      return {
        ...state,
        OrderSummary: {
          ...state.OrderSummary,
          currency: data.currency,
          product: [...data.product],
          service: [...data.service],
          vatPercent: data.vatPercent,
          wallet: data.wallet,
          walletPercent: data.walletPercent,
          walletRefund: data.walletRefund,
        },
      };
    }
    case CHECKOUT: {
      const data = action.checkoutData;
      return {
        ...state,
        checkoutData: {
          ...state.checkoutData,
          orderType: data.orderType,
          pointWallet: data.point_wallet,
          refundWallet: data.refund_wallet,
          totalPrice: data.total_price,
          pointsPay: data.points_pay,
          walletPay: data.wallet_pay,
          cardPay: data.card_pay,
          serviceDetails: [...data.serviceDetails],
          product: [...data.product],
          vat: data.vat,
          vatPercent: data.vatPercent,
          walletPercent: data.walletPercent,
          paymentType: data.payment_type,
          totalAmount: data.total_amount,
          cvwrAmount: data.cvwr_amount,
          currency: data.currency,
          deliveryCharges: data.delivery_charges,
          address: {
            id: data.address.id,
            userId: data.address.user_id,
            userName: data.address.user_name,
            userAddress: data.address.user_address,
            buildingName: data.address.building_name,
            userCountry: data.address.user_country,
            userCity: data.address.user_city,
            userPhoneCode: data.address.user_phone_code,
            userPhoneNumber: data.address.user_phone_number,
            defaultAdd: data.address.default_add,
            latitude: data.address.latitude,
            longitude: data.address.longitude,
            createdAt: data.address.created_at,
            updatedAt: data.address.updated_at,
            cityName: data.address.city_name,
            countryName: data.address.country_name,
          },
          // Payment gateway
          paymentResponse: {
            ...data.paymentResponse,
          },
        },
      };
    }
    default:
      return state;
  }
};
