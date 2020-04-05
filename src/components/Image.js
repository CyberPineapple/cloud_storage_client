import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import url from '../config';

export default class ImageItem extends Component {
  handlePress = ({nativeEvent}) => {
    if (nativeEvent.state === 5) {
      const {id, selectImage} = this.props;
      selectImage(id);
    }
  };
  render() {
    const {smallUrl, OriginalUrl, id, isSelect} = this.props;
    return (
      <View style={{width: '40%', height: 100}}>
        {isSelect && (
          <View
            style={{
              width: 25,
              height: 25,
              backgroundColor: 'blue',
              borderRadius: 50,
              position: 'absolute',
              zIndex: 2,
            }}></View>
        )}
        <TapGestureHandler
          onHandlerStateChange={this.handlePress}
          style={{flex: 1}}>
          <Image
            source={{uri: `${url}${smallUrl}`}}
            style={{
              flex: 1,
              resizeMode: 'cover',
              marginVertical: 10,
              borderWidth: 2,
              borderColor: 'black',
            }}
          />
        </TapGestureHandler>
      </View>
    );
  }
}
