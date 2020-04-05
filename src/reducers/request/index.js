import * as actionTypes from '../../constants/actionTypes.js';

const initialState = {
  loading: true,
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case actionTypes.LOADING:
      return {...state, loading: payload};
    default:
      return state;
  }
};
