import axios from 'axios';

export const SET_SERVICE_TYPE = 'SET_SERVICE_TYPE';
export const SET_SUB_SERVICE = 'SET_SUB_SERVICE';
export const SET_CHILD_SERVICE = 'SET_CHILD_SERVICE';
export const SEARCHLIST = 'SEARCHLIST';
export const GET_TESTIMONIAL = 'GET_TESTIMONIAL';

export const setServiceType = () => {
  return async dispatch => {
    const response = await axios.get('user/get-services');
    dispatch({type: SET_SERVICE_TYPE, services: response.data.data.services});
  };
};

export const setSubService = serviceId => {
  return async dispatch => {
    const response = await axios.get('user/get-sub-services/' + serviceId);

    dispatch({
      type: SET_SUB_SERVICE,
      subServices: response.data.data.subservice,
    });
  };
};

export const setChildService = (serviceId, childId) => {
  return async dispatch => {
    console.log(serviceId,childId)
    const response = await axios.get(
      'user/get-child-services/' + serviceId + '/' + childId,
    );

    dispatch({
      type: SET_CHILD_SERVICE,
      childServices: response.data.data.childservice,
    });
  };
};

export const getSearch = (search = '') => {
  return async dispatch => {
    const formData = new FormData();
    formData.append('search', search);

    const response = await axios.post('user/search-service', formData);

    if (response.data.result) {
      dispatch({type: SEARCHLIST, searchData: response.data.data});
    } else {
      dispatch({type: SEARCHLIST, searchData: []});
    }
  };
};

export const getTestimonial = () => {
  return async dispatch => {
    const response = await axios.get('user/get-rate-us');
    dispatch({type: GET_TESTIMONIAL, testimonial: response.data.data});
  };
};