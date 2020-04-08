import React, {Component} from 'react';

import {connect} from 'react-redux';
import actions from '../actions';
import {
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import Image from './Image.js';
import url from '../config';
import Icon from 'react-native-vector-icons/Feather';

class Main extends Component {
  state = {
    selectedImages: [],
    isColumnView: true,
    isSelectMode: false,
  };

  componentDidMount() {
    const {getImages} = this.props;
    getImages();
  }

  downloadHandler = () => {
    const {downloadImages} = this.props;
    const {selectedImages} = this.state;
    downloadImages(selectedImages);
    this.setState({selectedImages: [], isSelectMode: false});
  };

  deleteHandler = () => {
    const {deleteImages} = this.props;
    const {selectedImages} = this.state;
    deleteImages(selectedImages);
    this.setState({selectedImages: [], isSelectMode: false});
  };

  selectModeHandler = id => {
    if (this.state.isSelectMode) return;
    Vibration.vibrate(100);
    this.setState({isSelectMode: true});
    setTimeout(() => this.selectImage(id), 0);
  };

  selectImage = id => {
    const {selectedImages, isSelectMode} = this.state;
    if (!isSelectMode) return;
    let newSelectedImages;
    if (selectedImages.includes(id)) {
      newSelectedImages = selectedImages.filter(v => v !== id);
    } else {
      newSelectedImages = [...selectedImages, id];
    }

    if (!newSelectedImages.length) {
      this.setState({isSelectMode: false});
    }

    this.setState({selectedImages: newSelectedImages});
  };

  toggleViewStyle = () => {
    this.setState(prevState => ({isColumnView: !prevState.isColumnView}));
  };

  render() {
    const {selectedImages, isColumnView} = this.state;
    const {imagesList, loading, uploadImages} = this.props;

    if (loading) {
      return (
        <View
          style={{flex: 1, justifyContent: 'center', backgroundColor: 'black'}}>
          <ActivityIndicator size="large" color="rgb(110, 41, 250)" />
        </View>
      );
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 20,
          }}>
          <TouchableOpacity
            onPress={this.toggleViewStyle}
            style={{width: 50, height: 50, marginHorizontal: 10}}>
            <Icon
              name={isColumnView ? 'grid' : 'image'}
              size={50}
              color="rgb(110, 41, 250)"
            />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {selectedImages.length ? (
              <>
                <TouchableOpacity
                  onPress={this.deleteHandler}
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="x" size={60} color="rgb(240, 49, 49)" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={this.downloadHandler}
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="download" size={50} color="rgb(8, 201, 8)" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={uploadImages}
                style={{
                  width: 50,
                  height: 50,
                  marginHorizontal: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="plus" size={50} color="rgb(8, 201, 8)" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: isColumnView ? 'column' : 'row',
            alignContent: 'center',
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
              selectModeToggle={this.selectModeHandler}
              isColumnView={isColumnView}
            />
          ))}
        </ScrollView>
      </View>
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
  downloadImages: actions.downloadImages,
  deleteImages: actions.deleteImages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
