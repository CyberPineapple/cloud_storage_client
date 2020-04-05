import * as actionTypes from '../../constants/actionTypes.js';

const initialState = {
  imagesList: [],
};

export default (state = initialState, {type, payload}) => {
  switch (type) {
    case actionTypes.SET_IMAGES:
      return {...state, imagesList: payload};
    default:
      return state;
  }
};
