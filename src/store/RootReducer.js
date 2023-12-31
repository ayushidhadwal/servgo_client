import {combineReducers} from 'redux';
import {LOGOUT} from './actions/auth';
import authReducer from './reducers/auth';
import homeReducer from './reducers/home';
import userReducer from './reducers/user';
import requestReducer from './reducers/request';
import addressReducer from './reducers/address';
import langReducer from './reducers/lang';
import productReducer from './reducers/product';
import cartReducer from './reducers/cart';
import orderReducer from './reducers/order';

const appReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  user: userReducer,
  request: requestReducer,
  address: addressReducer,
  lang: langReducer,
  product: productReducer,
  cart: cartReducer,
  order: orderReducer,
});

export const RootReducer = (state, action) => {
  if (action.type === LOGOUT) {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};