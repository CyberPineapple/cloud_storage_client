import ImagePicker from 'react-native-image-crop-picker';
import {Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
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
    dispatch(getImages());
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

export const downloadImages = selectedImages => (dispatch, getState) => {
  dispatch(setLoading(true));
  const imagesList = getState().images.imagesList;
  const downloadImages = imagesList.filter(v => selectedImages.includes(v.id));

  const promArray = [];
  downloadImages.forEach(image => {
    const prom = new Promise((resolve, reject) => {
      setTimeout(() => {
        const regexp = /\.\w+$/;
        const path = `${
          RNFetchBlob.fs.dirs.PictureDir
        }/cloud_storage/${Date.now()}${regexp.exec(image.original_image_url)}`;
        RNFetchBlob.config({
          path,
        })
          .fetch('GET', `${url}${image.original_image_url}`)
          .then(res => {
            RNFetchBlob.fs.scanFile([{path: res.path()}]);
            console.log(res.path());
            resolve();
          })
          .catch(err => {
            console.log(err);
            reject();
          });
      }, 0);
    });
    promArray.push(prom);
  });

  Promise.all(promArray)
    .finally(() => {
      dispatch(setLoading(false));
    })
    .then(() => {
      Alert.alert('Загрузка окончена', 'Картинки успешно загружены');
    })
    .catch(() => {
      Alert.alert(
        'Возникла ошибка',
        'К сожалению неудалось загрузить все картинки, была загружена лишь часть',
      );
    });
};

export const deleteImages = selectedImages => async dispatch => {
  try {
    dispatch(setLoading(true));

    const body = {
      files: selectedImages,
    };

    await fetch(`${url}/images`, {
      method: 'DELETE',
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
