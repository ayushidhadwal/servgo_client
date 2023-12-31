import {
  SET_SERVICE_TYPE,
  SET_SUB_SERVICE,
  SET_CHILD_SERVICE,
  GET_TESTIMONIAL,
  SEARCHLIST,
} from '../actions/home';

const initialState = {
  services: [],
  subServices: [],
  childServices: [],
  testimonial: [],
  searchData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_SERVICE_TYPE: {
      return {
        ...state,
        services: [...action.services],
      };
    }
    case SET_SUB_SERVICE: {
      return {
        ...state,
        subServices: [...action.subServices],
      };
    }
    case SET_CHILD_SERVICE: {
      return {
        ...state,
        childServices: [...action.childServices],
      };
    }
    case SEARCHLIST: {
      return {
        ...state,
        searchData: [...action.searchData],
      };
    }
    case GET_TESTIMONIAL: {
      return {
        ...state,
        testimonial: [...action.testimonial],
      };
    }
    default:
      return state;
  }
};
