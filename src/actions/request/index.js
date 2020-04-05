import * as actionTypes from '../../constants/actionTypes.js';

export default setLoading = payload => ({
  type: actionTypes.LOADING,
  payload,
});
