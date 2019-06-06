import React from 'react';
import styles from './styles.js'
import Home from './screens/Home.js'
import { 
  Text, 
  View 
} from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Home/>
      </View>
    );
  }
}