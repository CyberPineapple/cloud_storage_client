import React, {Component} from 'react';

import {connect} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import actions from '../actions';
import {
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Image from './Image.js';
import url from '../config';
import Icon from 'react-native-vector-icons/FontAwesome';

class Main extends Component {
  state = {
    loading: true,
    images: [],
    selectedImages: [],
  };

  componentDidMount() {
    const {getImages} = this.props;
    getImages();
  }

  selectImage = id => {
    const {selectedImages} = this.state;
    let newSelectedImages;
    if (selectedImages.includes(id)) {
      newSelectedImages = selectedImages.filter(v => v !== id);
    } else {
      newSelectedImages = [...selectedImages, id];
    }
    this.setState({selectedImages: newSelectedImages});
  };

  downloadImages = () => {
    this.setState({loading: true, selectedImages: []});
    const {images, selectedImages} = this.state;
    const downloadImages = images.filter(v => selectedImages.includes(v.id));

    const promArray = [];
    downloadImages.forEach(image => {
      const prom = new Promise((resolve, reject) => {
        setTimeout(() => {
          const regexp = /\.\w+$/;
          const path = `${
            RNFetchBlob.fs.dirs.PictureDir
          }/cloud_storage/${Date.now()}${regexp.exec(
            image.original_image_url,
          )}`;
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

    console.log(promArray);
    Promise.all(promArray).finally(() => {
      this.setState({loading: false});
    });
  };

  render() {
    const {selectedImages} = this.state;
    const {imagesList, loading, uploadImages} = this.props;

    console.log('imagesList', imagesList);

    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          {/* <Icon name="rocket" size={60} color="#900" /> */}
          <ActivityIndicator size="large" color="green" />
        </View>
      );
    }

    return (
      <ScrollView
        style={{
          flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 20,
          }}>
          <TouchableOpacity
            onPress={uploadImages}
            style={{width: 50, height: 50}}>
            <Text style={{fontSize: 50}}>+</Text>
          </TouchableOpacity>
          {selectedImages.length ? (
            <TouchableOpacity onPress={this.downloadImages}>
              <Text style={{fontSize: 30}}>download</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
          }}>
          {imagesList.map(image => (
            <Image
              smallUrl={image.small_image_url}
              key={image.id}
              selectImage={this.selectImage}
              id={image.id}
              isSelect={selectedImages.includes(image.id)}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  imagesList: state.images.imagesList,
  loading: state.request.loading,
});

const mapDispatchToProps = {
  getImages: actions.getImages,
  uploadImages: actions.uploadImages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
