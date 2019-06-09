import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import CameraComponent from '../components/Camera'; // 新規作成ファイル


export default class Profile extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <CameraComponent {...this.props} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});