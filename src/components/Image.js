import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import url from '../config';

export default class ImageItem extends Component {
  handlePress = ({nativeEvent}) => {
    if (nativeEvent.state === 5) {
      const {id, selectImage} = this.props;
      selectImage(id);
    }
  };

  handleLongPress = ({nativeEvent}) => {
    if (nativeEvent.state === 4) {
      const {id, selectModeToggle} = this.props;
      selectModeToggle(id);
    }
  };

  render() {
    const {
      smallUrl,
      OriginalUrl,
      id,
      isSelect,
      isColumnView,
      selectModeToggle,
    } = this.props;
    return (
      <View
        style={{
          width: isColumnView ? '90%' : '40%',
          height: isColumnView ? 300 : 200,
        }}>
        {isSelect && (
          <Icon
            name="check-circle"
            size={30}
            color="rgb(8, 201, 8)"
            style={{position: 'absolute', zIndex: 2, left: -14}}
          />
        )}
        <LongPressGestureHandler
          onHandlerStateChange={this.handleLongPress}
          minDurationMs={300}>
          <TapGestureHandler
            onHandlerStateChange={this.handlePress}
            style={{flex: 1}}>
            <Image
              source={{uri: `${url}${smallUrl}`}}
              style={{
                flex: 1,
                resizeMode: 'contain',
                marginVertical: 10,
              }}
            />
          </TapGestureHandler>
        </LongPressGestureHandler>
      </View>
    );
  }
}
