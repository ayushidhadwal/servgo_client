import {
  GET_PRODUCT_LIST,
  GET_PRODUCT_DETAILS,
  ADD_TO_CART,
  GET_CATEGORY_LIST,
  GET_SUBCATEGORY_LIST,
} from '../actions/product';

const initialState = {
  CategoryList: [],
  subCategoryList: [],
  ProductList: [],

  productDetails: {
    productId: null,
    title: '',
    titleArabic: '',
    sellingPrice: null,
    MRP: null,
    inventory: null,
    discount: null,
    description: '',
    arabicDescription: '',
    productImage1: '',
    productImage2: '',
    productImage3: '',
    productImage4: '',
    branchId: null,
    vendorId: null,
    inCart: false,
    currency: '',
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCT_LIST: {
      return {
        ...state,
        ProductList: [...action.ProductList],
      };
    }
    case GET_PRODUCT_DETAILS: {
      const data = action.productDetails;
      return {
        ...state,
        productDetails: {
          productId: data.id,
          title: data.title,
          titleArabic: data.title_arabic,
          sellingPrice: data.Selling_Price,
          MRP: data.MRP,
          inventory: data.inventory,
          discount: data.discount,
          description: data.description,
          arabicDescription: data.arabic_description,
          productImage1: data.product_image1,
          productImage2: data.product_image2,
          productImage3: data.product_image3,
          productImage4: data.product_image4,
          branchId: data.branch_id,
          vendorId: data.vendor_id,
          inCart: data.inCart,
          currency: data.currency,
        },
      };
    }
    case ADD_TO_CART: {
      const productDetails = state.productDetails;
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          inCart: Number(action.productId) === Number(productDetails.productId),
        },
      };
    }
    case GET_CATEGORY_LIST: {
      return {
        ...state,
        CategoryList: [...action.CategoryList],
      };
    }
    case GET_SUBCATEGORY_LIST: {
      return {
        ...state,
        subCategoryList: [...action.subCategoryList],
        ProductList: [...action.ProductList],
      };
    }
    default:
      return state;
  }
};
