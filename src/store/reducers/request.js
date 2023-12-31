import {
  GET_SERVICE_PROVIDER,
  GET_BOOKING,
  GET_SERVICE_PROVIDER_REVIEW,
  GET_SERVICE_PROVIDER_PROFILE,
  REQUEST_SERVICE,
  PAY_ORDER_DETAILS,
  GET_COMPLETED_REQUEST,
  CANCEL_REQUEST,
  GET_PAYMENT_AMOUNT,
  GET_BOOKING_DETAILS,
  PICTURES_OF_BOOKING,
  GET_ORDER_DETAILS,
  GET_PARTNER_SERVICES,
  GET_SAME_BOOKING_LIST,
  GET_MULTIPLE_PAYMENT
} from '../actions/request';

const initialState = {
  serviceProvider: [],
  service: {
    id: null,
    en_service_name: '',
    ar_service_name: '',
    service_icon: '',
  },
  subService: {
    id: null,
    service_id: null,
    image: '',
    en_subcategory_name: '',
    ar_subcategory_name: '',
    child_cat: null,
  },
  bookingList: [],
  providerReview: [],
  providerProfile: {
    services: [],
    servicePricing: [],
    behaviourRating: 0,
    valueForMoneyRating: 0,
    serviceRating: 0,
    totalRating: 0,
    gallery: [],
    currency: '',
    profile: {
      partner_id: '',
      company_name: '',
      photo: '',
      overview: '',
    },
  },
  completedRequest: [],
  partnerServices: [],
  sameBookingList: [],

  // order details
  payOrderDetails: {
    booking: {
      id: null,
      booking_id: '',
      booking_date: '',
      booking_time: '',
      service_price: '',
      final_service_price: '',
    },
    serviceDetails: [],
    wallet: '',
    total: '',
    payableWall: null,
    vat: '',
    cardpay: '',
    vatPercent: '',
    walletPercent: '',
    refund_wallet: '',
    currency: '',
  },
  paymentAmountDetails: {
    card_pay: '',
    payable_amount: '',
    point_wallet: '',
    points_pay: '',
    refund_wallet: '',
    serviceDetails: [],
    total_amount: '',
    total_price: '',
    vat: '',
    vat_percent: '',
    wallet_pay: '',
    currency: '',
    paymentResponse: null,
  },
  multiplePaymentDetails: null,
  // subService_provider: {
  //   id: 0,
  //   service_id: 0,
  //   image: '',
  //   subcategory_name: '',
  // },
  pictures: {
    date: '',
    description: '',
    images: [],
    time: '',
  },
  serviceOrdered: {
    booking_details: {
      booking_id: '',
      booking_date: '',
      booking_time: '',
      service_price: null,
      final_service_price: '',
      total_price: null,
      price_paid: null,
      wallet_pay: null,
      vat_amount: '',
      message: null,
      service_id: null,
      qty: null,
      vendor_id: 0,
      status: '',
      payment_status: '',
      rejected_by: '',
      refund_status: '',
      job_completed_comment: null,
      confirm_status: '',
      confirm_reason: null,
      reason: null,
      address_id: 0,
      addr_username: '',
      addr_address: '',
      addr_country: '',
      addr_city: '',
      addr_phonenumber: '',
      booking_comment: null,
    },
    serviceDetails: [],
    serviceConfirmation: [],
    complaints: {
      cr_subject: '',
      cr_comment: '',
      feedback: '',
    },
    setting: {
      application_name: '',
      address: '',
    },
    currency: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_SERVICE_PROVIDER: {
      return {
        ...state,
        serviceProvider: [...action.serviceProvider],
        service: {
          ...action.service,
        },
        subService: {
          ...action.subService,
        },
      };
    }
    case GET_PARTNER_SERVICES: {
      return {
        ...state,
        partnerServices: [...action.partnerServices],
      }
    }

    case GET_BOOKING: {
      return {
        ...state,
        bookingList: [...action.bookingList],
      };
    }
    case GET_SAME_BOOKING_LIST: {
      return {
        ...state,
        sameBookingList: [...action.sameBookingList],
      };
    }
    case CANCEL_REQUEST: {
      const bookingLists = [...state.bookingList];
      const booking_id = action.booking_id;
      const i = bookingLists.findIndex(obj => obj.booking_id === booking_id);

      if (i > -1) {
        bookingLists[i] = {
          ...bookingLists[i],
          service_status: 'CANCELLED',
        };
      }

      return {
        ...state,
        bookingList: bookingLists,
      };
    }
    case REQUEST_SERVICE: {
      return {
        ...state,
        bookingId: action.bookingId,
      };
    }
    case GET_SERVICE_PROVIDER_REVIEW: {
      return {
        ...state,
        providerReview: [...action.providerReview],
      };
    }
    case GET_COMPLETED_REQUEST: {
      return {
        ...state,
        completedRequest: [...action.completedRequest],
      };
    }
    case GET_SERVICE_PROVIDER_PROFILE: {
      const data = action.providerProfile;
      return {
        ...state,
        providerProfile: {
          services: data.services,
          servicePricing: data.service_pricing,
          behaviourRating: data.behaviour_rating,
          valueForMoneyRating: data.value_for_money_rating,
          serviceRating: data.service_rating,
          totalRating: data.total_rating,
          gallery: data.gallery,
          profile: data.profile,
          currency: data.currency,
        },
      };
    }
    case PAY_ORDER_DETAILS: {
      const data = action.payOrderDetails;
      return {
        ...state,
        payOrderDetails: {
          booking: data.booking,
          serviceDetails: data.serviceDetails,
          wallet: data.wallet,
          total: data.total,
          payableWall: data.payableWall,
          vat: data.vat,
          cardpay: data.cardpay,
          vatPercent: data.vatPercent,
          walletPercent: data.walletPercent,
          refund_wallet: data.refund_wallet,
          currency: data.currency,
        },
      };
    }
    case GET_PAYMENT_AMOUNT: {
      const data = action.paymentAmountDetails;
      return {
        ...state,
        paymentAmountDetails: {
          card_pay: parseFloat(data.card_pay.replace(',', '')),
          payable_amount: parseFloat(data.payable_amount.replace(',', '')),
          point_wallet: data.point_wallet,
          points_pay: data.points_pay,
          refund_wallet: data.refund_wallet,
          serviceDetails: data.serviceDetails,
          total_amount: parseFloat(data.total_amount.replace(',', '')),
          total_price: data.total_price,
          vat: parseFloat(data.vat.replace(',', '')),
          vat_percent: parseFloat(data.vat_percent.replace(',', '')),
          wallet_pay: data.wallet_pay,
          currency: data.currency,
          paymentResponse: { ...data.paymentResponse },
        },
      };
    }
    case GET_MULTIPLE_PAYMENT: {
      const data = action.multiplePaymentDetails;
      return {
        ...state,
        multiplePaymentDetails: {
          card_pay: parseFloat(data.card_pay.replace(',', '')),
          payable_amount: parseFloat(data.payable_amount.replace(',', '')),
          point_wallet: data.point_wallet,
          points_pay: data.points_pay,
          refund_wallet: data.refund_wallet,
          serviceDetails: data.serviceDetails,
          total_amount: parseFloat(data.total_amount.replace(',', '')),
          total_price: data.total_price,
          vat: parseFloat(data.vat.replace(',', '')),
          vat_percent: parseFloat(data.vat_percent.replace(',', '')),
          wallet_pay: data.wallet_pay,
          currency: data.currency,
          paymentResponse: { ...data.paymentResponse },
        }
      }
    }
    case PICTURES_OF_BOOKING: {
      const data = action.pictures;
      return {
        ...state,
        pictures: {
          date: data.date,
          description: data.description,
          images: data.images,
          time: data.time,
        },
      };
    }
    case GET_ORDER_DETAILS: {
      return {
        ...state,
        serviceOrdered: {
          booking_details: {
            ...action.serviceOrdered.booking_details,
          },
          setting: {
            ...action.serviceOrdered.setting,
          },
          serviceDetails: [...action.serviceOrdered.serviceDetails],
          serviceConfirmation: [...action.serviceOrdered.serviceConfirmation],
          complaints: {
            ...action.serviceOrdered.complaints,
          },
          currency: action.serviceOrdered.currency,
        },
      };
    }
    default:
      return state;
  }
};
