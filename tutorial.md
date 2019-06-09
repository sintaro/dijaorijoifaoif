# How to Build Tinder

## Class 0 - React Native vs. Expo

  * UPDATES
    * React Native - has more up to date code with iOS firmware
    * Expo - less updates but cleaner no breaking code
  * FLEXIBILITY
    * React Native - emulates more native code and features
    * Expo - has less features but they work better
  * CODEBASE
    * React Native - Android & iOS have different codebases but 85% can usually be copy and pasted into iOS
    * Expo - One code base
        * exp build:ios & exp build:android (AWESOME)
  * NOTIFICATIONS
    * React Native - create your own server, much more complicated
    * Expo - provided framework out of the box to allow and use notifications
  * LOGIN
    * React Native - BYOL Bring Your Own Login. Can use any service but must implement and figure it out on your own
    * Expo - Less options but exposes minimal native API for Facebook & Google (can also easily implement firebase on both)
  * TESTING
    * React Native - Must go through apple to add test users with Apple account
    * Expo - Use ecosystem to test through expo app on both iOS & Android
  * DEV TEAM
    * React Native - Facebook’s huge dev team constantly implementing new features
    * Expo - A lot of the devs work open source but have previously built a lot of the existing React Native modules










---------------------------------------------------------------------------------










## Class 1 - Getting Started With Expo

[Download Expo iPhone App](https://xde-updates.exponentjs.com/download/mac)
[Download Xcode](https://itunes.apple.com/app/xcode/id497799835)
[Download Node](https://nodejs.org/en/)
[Download Watchman](https://facebook.github.io/watchman/docs/install.html)
[Expo Documentation](https://docs.expo.io/versions/latest/introduction/installation.html)

```
npm install -g exp
npm install -g create-react-native-app
create-react-native-app Tinder
cd Tinder
npm start or yarn start 
```

Developer Tools Simulator (command + D)











---------------------------------------------------------------------------------













## Class 2 - Organize Folder Structure

FOLDER STRUCTURE
  expo - (default)
  assets - (images, logos, icons, fonts, splashscreens)
  components (modules that arent pages used in multple areas)
  config - (credentials for AWS & Firebase)
  navigation - (react navigation struture)
  node_modules - (default)
  redux - (actions & reducers)
  screens - (Chat, Home, Login, Matches, Profile)
App.js - (Initial page called on app startup)
styles.js - (overall app styling)
app.json - (settings for xCode & expo)
package.json - (file for app info and node modules)

Test.js
```
import React from 'react';
import styles from '../styles'

import { 
  Text, 
  View
} from 'react-native';

class Chat extends React.Component {
  state = {}

  componentWillMount() {}

  render() {
    return (
     <View>
      <Text>Test</Text>
     </View>
    )
  }
}

export default Test;

```

styles.js
```
import React from 'react';
import { StyleSheet } from 'react-native';

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

module.exports = styles
``









---------------------------------------------------------------------------------











## Class 3 - Add Navigation

[React Navigation Documentation](https://reactnavigation.org/docs/intro/)
[Options for TabNavigator](https://reactnavigation.org/docs/navigators/tab/)

```
npm install react-navigation --save
```

TabNavigator.js
```
import React from 'react';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Matches from '../screens/Matches';
import { TabNavigator } from 'react-navigation';

export default TabNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: 'Profile',
      },
    },
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarLabel: 'Home',
      }
    },
    Matches: {
      screen: Matches,
      navigationOptions: {
        tabBarLabel: 'Matches',
      },
    },
  },
  {
    navigationOptions: {
      header: null
    },
    tabBarPosition: 'top',
    initialRouteName: 'Home',
    animationEnabled: true,
    swipeEnabled: false,
    tabBarOptions: {
      style: {
        height: 100,
        backgroundColor: '#fff',
      },
    }
  }
);
```

RootNavigation.js
```
import React from 'react';
import { StackNavigator } from 'react-navigation';
import TabNavigator from './TabNavigator';

const RootStackNavigator = StackNavigator(
  {
    Main: {
      screen: TabNavigator,
    },
  }
);

export default class RootNavigator extends React.Component {
  render() {
    return <RootStackNavigator/>;
  }
}
```







-----------------------------------------------------------------------------------------------------------









## Class 4 - Redux Integration

```
npm install --save redux redux-thunk react-redux 
```
actions.js
```
export function login(){
  return function(dispatch){
    dispatch({ type: 'LOGIN', payload: 'test' });
  }
}
```

reducers.js
```
export default reducers = (state = {
    user: '',
  }, action) => {
    switch (action.type) {
      case 'LOGIN': {
        return { ...state, user: action.payload }
      }
    }
    return state;
} 
```

App.js
```
import React from 'react';
import RootNavigator from './navigation/RootNavigator';
import reducers from './redux/reducers';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
const middleware = applyMiddleware(thunkMiddleware)
const store = createStore(reducers, middleware);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <RootNavigator/>
      </Provider>
    );
  }
}
```

Import connect into component
```
import { connect } from 'react-redux';
import { login } from '../redux/actions'
```

Use connect in components
```
function mapStateToProps(state) {
  return {
    user: state.user
  };
}
```

Export connect enabled component
```
export default connect(mapStateToProps)(Test);
```

Call redux function
```
this.props.dispatch(login())
```











-----------------------------------------------------------------------------------------------------------












## Class 5 - Create Facebook Login

[Facebook Login Quickstart](https://developers.facebook.com/docs/facebook-login/ios)
[Facebook Apps Dashboard](https://developers.facebook.com/apps)
[Expo Facebook Login Documentation](https://docs.expo.io/versions/latest/sdk/facebook.html)


Registering App with Facebook
Bundle ID -  host.exp.Exponent
Android Key - rRW++LUjmZZ+58EbN5DVhGAnkX4=

App.json
```
{
  "expo": {
    "sdkVersion": "25.0.0",
    "FacebookAppID":"APPID",
    "facebookDisplayName": "Tinder"
  }
}
```

App.js - Login function 
```
login = async () => {
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('APPID', {
      permissions: ['public_profile'],
    });
  if (type === 'success') {
    // Get the user's name using Facebook's Graph API
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`);
    Alert.alert(
      'Logged in!',
      `Hi ${(await response.json()).name}!`,
    );
  }
}  
```










-----------------------------------------------------------------------------------------------------------












## Class 6 - Firebase Integration

[Signup for Firebase](https://console.firebase.google.com)
[Expo Firebase Documentation](https://docs.expo.io/versions/latest/guides/using-firebase.html)

Install Firebase
```
npm install --save firebase
```

Setup Firebase
```
import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "<YOUR-API-KEY>",
  authDomain: "<YOUR-AUTH-DOMAIN>",
  databaseURL: "<YOUR-DATABASE-URL>",
  storageBucket: "<YOUR-STORAGE-BUCKET>"
};

firebase.initializeApp(firebaseConfig);
```


Login With Facebook and store user with Firebase
```
  const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(
    '1576176899112755',
    { permissions: ['public_profile'] }
  );

  if (type === 'success') {
    // Build Firebase credential with the Facebook access token.
    const credential = await firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    firebase.auth().signInWithCredential(credential).catch((error) => {
      // Handle Errors here.
      Alert.alert("Try Again")
    });
  }
```


Check if user has already authenticated
```
firebase.auth().onAuthStateChanged((user) => {
  if (user != null) {
    this.setState({ loggedIn: true });
    console.log("We are authenticated now!" + JSON.stringify(user));
  }
});
```










-----------------------------------------------------------------------------------------------------------











## Class 7 - Profile Update

[Firebase Documentation](https://firebase.google.com/docs/database/web/read-and-write)

```
let params = {
  id: user.uid,
  photoUrl: user.photoURL,
  name: user.displayName,
  aboutMe: ' ',
  chats: ' ',
  geocode: ' ',
  images: [user.photoURL],
  notification: false,
  show: false,
  report: false,
  swipes: {
    [user.uid]: false
  },
  token: ' ',
}

firebase.database().ref('cards/').child(user.uid).once('value', function(snapshot){
  if(snapshot.val() !== null){
    dispatch({ type: 'LOGIN', payload: snapshot.val() });
  } else {
    firebase.database().ref('cards/' + user.uid ).update(params);
    dispatch({ type: 'LOGIN', payload: params });
  }
})
```










-----------------------------------------------------------------------------------------------------------












## Class 8 - AWS Image Upload

[Expo Image Picker](https://docs.expo.io/versions/latest/sdk/imagepicker.html)
[AWS S3 Image Upload](https://github.com/benjreinhart/react-native-aws3)

npm install --save react-native-aws3

Add the Imagepicker Module from Expo
actions.js
```
import aws from '../config/aws';
import { ImagePicker } from 'expo';
import { RNS3 } from 'react-native-aws3';

ImagePicker.launchImageLibraryAsync({ allowsEditing: false }).then(function(result){

  var array = images
  if(result.uri != undefined){
    const file = {
      uri: result.uri,
      name: result.uri,
      type: "image/png"
    }

    const options = {
      keyPrefix: "uploads/",
      bucket: "BUCKETNAME",
      region: "us-east-1",
      accessKey: aws.accessKey,
      secretKey: aws.secretKey,
      successActionStatus: 201
    }

    RNS3.put(file, options).then(function(response){
      if (response.status === 201){
        array.push(response.body.postResponse.location)
        firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
        dispatch({ type: 'UPLOAD_IMAGES', payload: array });
      }
    })
  }

})
```
Profile.js
```
this.props.dispatch(uploadImages(this.props.user.images))

  {this.props.user.images.map((uri, key)=>{
    return (
      <TouchableOpacity key={{key}} >
        <Image source={{uri: uri}} />
      </TouchableOpacity>
    );
  })}
```










-----------------------------------------------------------------------------------------------------------













## Class 9 - Profile

actions.js
```
Alert.alert(
  'Are you sure you want to Delete',
  '',
  [
    {text: 'Ok', onPress: () => {
      var array = images
      array.splice(key, 1)
      dispatch({ type: 'UPLOAD_IMAGES', payload: array });
      firebase.database().ref('cards/' + firebase.auth().currentUser.uid + '/images').set(array);
    }},
    {text: 'Cancel', onPress: () => console.log('Cancel Pressed')},
  ],
  { cancelable: true }
)
```

styles.js
```
img: {
  width: 90,
  height: 90,
  borderRadius: 45,
  margin: 10,
  backgroundColor: '#fff',
},
imgRow: {
  flexWrap: 'wrap',
  flexDirection: 'row',
  padding: 15,
},
textInput: {
  width: deviceWidth,
  padding: 15,
  backgroundColor: '#fff',
  height: 100
},
bold: {
  padding: 10,
  fontSize: 18,
  fontWeight: 'bold',
},
button: {
  borderRadius: 15,
  borderWidth: 1,
  borderColor: '#df4723',
  textAlign: 'center',
  color: '#df4723',
  padding: 15,
  margin: 15,
  fontSize: 18,
  fontWeight: 'bold',
}
```











-----------------------------------------------------------------------------------------------------------














## Class 10 - Tinder Cards

[React Native Tinder Card Module](https://github.com/meteor-factory/react-native-tinder-swipe-cards)

npm install --save react-native-swipe-cards

SwipeCards.js
```
class Card extends React.Component {
  render() {
    return (
      <View>
        <Image source={{uri: this.props.image}} />
        <Text>{this.props.name}</Text>
      </View>
    )
  }
}

class NoMoreCards extends React.Component {
  render() {
    return (
      <View>
        <Text>No more cards</Text>
      </View>
    )
  }
}

export default class extends React.Component {
  state = {
    cards: [
      {name: 'fran', image: 'https://media.giphy.com/media/GfXFVHUzjlbOg/giphy.gif'},
      {name: 'jackie', image: 'https://media.giphy.com/media/irTuv1L1T34TC/giphy.gif'},
      {name: 'phil', image: 'https://media.giphy.com/media/LkLL0HJerdXMI/giphy.gif'},
      {name: 'jacks', image: 'https://media.giphy.com/media/fFBmUMzFL5zRS/giphy.gif'},
      {name: 'mellow', image: 'https://media.giphy.com/media/oDLDbBgf0dkis/giphy.gif'},
      {name: 'frank', image: 'https://media.giphy.com/media/7r4g8V2UkBUcw/giphy.gif'},
      {name: 'timmmay', image: 'https://media.giphy.com/media/K6Q7ZCdLy8pCE/giphy.gif'},
    ]
  };

  handleYup (card) {
    console.log(`Yup for ${card.name}`)
  }
  handleNope (card) {
    console.log(`Nope for ${card.name}`)
  }
  handleMaybe (card) {
    console.log(`Maybe for ${card.name}`)
  }
  render() {
    return (
      <SwipeCards
        cards={this.state.cards}
        stack={false}
        renderCard={(cardData) => <Card {...cardData} />}
        renderNoMoreCards={() => <NoMoreCards />}
        showYup={false}
        showNope={false}
        handleYup={this.handleYup}
        handleNope={this.handleNope}
        handleMaybe={this.handleMaybe}
        hasMaybeAction={false}/>
    )
  }
}
```
actions.js
```
firebase.database().ref('cards').once('value', (snap) => {
  var items = [];
  snap.forEach((child) => {
    item = child.val();
    item.id = child.key;
    items.push(item); 
  });
  dispatch({ type: 'GET_CARDS', payload: items });
});
```











-----------------------------------------------------------------------------------------------------------













## Class 11 - Home Update

Cards.js
```
nextPhoto(){
  var num = this.state.num
  var length = this.props.images.length -1
  if (num >= length) {
    this.setState({ num: 0 })
  } else {
    num += 1
    this.setState({ num: num })
  }
}
```

Home.js
```
handleYup (card) {
  firebase.database().ref('cards/' + this.props.user.id + '/swipes').update({ [card.id]: true });
}
```











-----------------------------------------------------------------------------------------------------------














## Class 12 - Matches

Home.js
```
checkMatch(card){
  firebase.database().ref('cards/' + card.id + '/swipes/' + this.props.user.id).once('value', (snap) => {
    if(snap.val() == true){
      var me = {
        id: this.props.user.id,
        photoUrl: this.props.user.photoUrl,
        name: this.props.user.name
      }
      var user = {
        id: card.id,
        photoUrl: card.photoUrl,
        name: card.name
      }
      firebase.database().ref('cards/' + this.props.user.id + '/chats/' + card.id).set({user: user});
      firebase.database().ref('cards/' + card.id + '/chats/' + this.props.user.id).set({user: me});
    }
  });
}
```


Matches.js
```
firebase.database().ref('cards/' + this.props.user.id + '/chats').on('value', (snap) => {
  var items = [];
  snap.forEach((child) => {
    item = child.val();
    items.push(item); 
  });
  this.setState({ chats: items.reverse() });
});


  <ScrollView>
    {this.state.chats.map((uri)=>{
      return (
        <TouchableOpacity style={styles.imgRow} >
          <Image style={styles.img} source={{uri: uri.user.photoUrl}} />
          <Text style={styles.bold}>{uri.user.name}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
```









-----------------------------------------------------------------------------------------------------------









## Class 13 - Chat Feature

[React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)

npm install --save react-native-gifted-chat

```
import { GiftedChat } from 'react-native-gifted-chat'

state = {
  messages: [],
}

componentWillMount() {
  firebase.database().ref('cards/' + this.props.user.id + '/chats/' + this.props.navigation.state.params.user.id).on('value', (snap) => {
    var items = [];
    snap.forEach((child) => {
      if(child.val().key != 'user'){
        item = child.val();
        items.push(item); 
      }
    });
    this.setState({ messages: items.reverse() });
}

onSend(messages = []) {
  this.setState(previousState => ({
    messages: GiftedChat.append(previousState.messages, messages),
  }))
  firebase.database().ref('cards/' + this.props.user.id + '/chats/' + this.props.navigation.state.params.user.id).push(messages[0]);
  firebase.database().ref('cards/' + this.props.navigation.state.params.user.id + '/chats/' + this.props.user.id).push(messages[0]);

}

render() {
  return (
    <GiftedChat
      messages={this.state.messages}
      onSend={messages => this.onSend(messages)}
      user={{
        _id: 1,
        name: "name",
        avatar: "image"
      }}
    />
  )
}
```

Navigate Routes
```
this.props.navigation.navigate("Chat", {user: uri.user})
```









-----------------------------------------------------------------------------------------------------------











## Class 14 - Location Services

[NPM Geohash](https://www.npmjs.com/package/latlon-geohash)

npm install --save latlon-geohash

```
import Geohash from 'latlon-geohash';
import { Location, Permissions } from 'expo';

Permissions.askAsync(Permissions.LOCATION).then(function(result){
  if(result){
    Location.getCurrentPositionAsync({}).then(function(location){
      var geocode = Geohash.encode(location.coords.latitude, location.coords.longitude, 4)
      firebase.database().ref('cards/' + firebase.auth().currentUser.uid).update({geocode: geocode});
      dispatch({ type: 'GET_LOCATION', payload: geocode });
    })
  }
})

```

query firebase on location
```
.orderByChild("geocode").equalTo(geocode)
```

#   km      
1   ±2500
2   ±630
3   ±78
4   ±20
5   ±2.4
6   ±0.61
7   ±0.076
8   ±0.019
9   ±0.0024
10  ±0.00060
11  ±0.000074












-----------------------------------------------------------------------------------------------------------











## Class 15 - Push Notifications

[Expo Push Notifications](https://docs.expo.io/versions/latest/guides/push-notifications.html)

Allow Notification
actions.js
```
import { Notifications } from 'expo';

Permissions.getAsync(Permissions.NOTIFICATIONS).then(function(result){
  if (result.status === 'granted') {
    Notifications.getExpoPushTokenAsync().then(function(token){
      firebase.database().ref('cards/' + firebase.auth().currentUser.uid ).update({ token: token });
      dispatch({ type: 'NOTIFICATION_TOKEN', payload: token });
    })
  }
})
```

Send Notification
actions.js
```
export function sendNotification(id, name, text){
  return function(dispatch){
    firebase.database().ref('cards/' + id).once('value', (snap) => {
      if(snap.val().token != null){

        return fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: snap.val().token,
            title: name,
            body: text,
            badge: 1,
          }),
        });

      }
    });
  }
}

```

Chat.js
```
this.props.dispatch(
  sendNotification(
    this.props.navigation.state.params.user.id, 
    messages[0].user.name, 
    messages[0].text
  )
)
```









-----------------------------------------------------------------------------------------------------------













## Class 16 - Publish & Submit App

[App Icons Expo](https://docs.expo.io/versions/latest/guides/app-icons.html)
[Splash Screens Expo](https://docs.expo.io/versions/latest/guides/splash-screens.html)
[Publish to Expo](https://docs.expo.io/versions/latest/guides/publishing.html)
[Apple Certificates](https://developer.apple.com/account/ios/certificate/?teamId=GVXC5FQ2RP)

Splash Screen - 1242w x 2436h .png
App Icon - 1024 x 1024 .png

exp publish - (publish to expo to test)
exp build:ios - (create .ipa build for iTunes)
exp build:android - (create .apk build for Google Play)

app.json
```
"expo": {
  "sdkVersion": "25.0.0",
  "icon": "./assets/tinder-icon.png",
  "version": "1.0",
  "name": "Tinder",
  "slug": "tinder",
  "splash": {
    "image": "./assets/tinder-splash.png",
    "backgroundColor": "#fff",
    "resizeMode": "contain"
  },
  "ios": {
    "bundleIdentifier": "com.tinder.tinder",
    "infoPlist": {
      "NSLocationWhenInUseUsageDescription": "Allow Tinder to use your location in order to find new people to hang out with in your area"
    }
  },
  "android": {
    "package": "com.tinder.tinder"
  }
}
```














