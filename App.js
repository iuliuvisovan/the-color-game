import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './screens/main';
import { createAppContainer } from 'react-navigation';
import { Dimensions, UIManager, Image, LayoutAnimation } from 'react-native';
import isDarkColor from 'is-dark-color';
import SplashScreenImage from './assets/images/splash.png';
import getRandomColor from './components/random-color';
import { SplashScreen } from 'expo';

global.currentColor = getRandomColor();
global.darkColor = '#14181c';

const StackNavigator = createAppContainer(
  createStackNavigator({
    Main: {
      screen: MainScreen,

      navigationOptions: ({ navigation }) => ({
        title: `Round ${(navigation.state.params || {}).currentRound || 1}/5`,
        headerStyle: {
          backgroundColor: (navigation.state.params || {}).currentColor || global.currentColor
        },
        headerTitleStyle: {
          color: isDarkColor((navigation.state.params || {}).currentColor || global.currentColor) ? '#fff' : '#14181c',
          fontWeight: '500'
        }
      })
    }
  })
);

export default class App extends Component {
  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  render() {
    return <StackNavigator />;
  }
}
