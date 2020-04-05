import ImagePicker from 'react-native-image-crop-picker';
import * as actionTypes from '../../constants/actionTypes.js';
import url from '../../config';
import setLoading from '../request';

export const getImages = () => async dispatch => {
  try {
    dispatch(setLoading(true));
    const response = await fetch(`${url}/images`);
    const result = await response.json();
    dispatch(setImagesToStore(result));
    dispatch(setLoading(false));
  } catch (err) {
    console.log(err);
  }
};

export const uploadImages = () => async dispatch => {
  try {
    const images = await ImagePicker.openPicker({
      multiple: true,
      includeBase64: true,
      mediaType: 'photo',
    });

    dispatch(setLoading(true));
    const formImages = images.map(
      image => `data:${image.mime};base64,${image.data}`,
    );

    const body = {
      files: formImages,
    };

    await fetch(`${url}/images`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    dispatch(getImages());
  } catch (err) {
    dispatch(setLoading(false));
    console.log(err);
  }
};

setImagesToStore = payload => ({
  type: actionTypes.SET_IMAGES,
  payload,
});
