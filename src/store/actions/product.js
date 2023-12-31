import axios from 'axios';

export const GET_PRODUCT_LIST = 'GET_PRODUCT_LIST';
export const GET_PRODUCT_DETAILS = 'GET_PRODUCT_DETAILS';
export const ADD_TO_CART = 'ADD_TO_CART';
export const GET_CATEGORY_LIST = 'GET_CATEGORY_LIST';
export const GET_SUBCATEGORY_LIST = 'GET_SUBCATEGORY_LIST';

export const getProductList = (serviceId, subId) => {
  return async dispatch => {
    const response = await axios.get(`user/product-list/${serviceId}/${subId}`);

    dispatch({
      type: GET_PRODUCT_LIST,
      ProductList: response.data.Data,
    });
  };
};

export const getProductDetail = productId => {
  return async dispatch => {
    const response = await axios.get(`user/get-product-details/${productId}`);

    if (response.data.status) {
      dispatch({
        type: GET_PRODUCT_DETAILS,
        productDetails: response.data.Data,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const addToCart = (productId, branchId, vendorId, sellingPrice, qty) => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('branchId', branchId);
    formData.append('vendorId', vendorId);
    formData.append('price', sellingPrice);
    formData.append('qty', qty);

    console.log(formData);

    const response = await axios.post('user/add-to-cart', formData);

    if (response.data.status) {
      dispatch({
        type: ADD_TO_CART,
        productId: productId,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};

export const getCategoryList = () => {
  return async dispatch => {
    const response = await axios.get('user/get-category-list');

    dispatch({
      type: GET_CATEGORY_LIST,
      CategoryList: response.data.data.categories,
    });
  };
};

export const getSubCategoryList = categoryId => {
  return async dispatch => {
    const response = await axios.get(`user/get-sub-categories/${categoryId}`);

    if (response.data.status) {
      let products = [];
      if (response.data.Data.subCategories.length > 0) {
        const [subcategory] = response.data.Data.subCategories;
        const productResponse = await axios.get(
          `user/product-list/${categoryId}/${subcategory.id}`,
        );

        products = [...productResponse.data.Data];
      }

      dispatch({
        type: GET_SUBCATEGORY_LIST,
        subCategoryList: response.data.Data.subCategories,
        ProductList: products,
      });
    } else {
      throw new Error(response.data.message);
    }
  };
};
