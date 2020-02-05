import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './screens/main';
import { createAppContainer } from 'react-navigation';
import { Dimensions, UIManager, View } from 'react-native';
import isDarkColor from 'is-dark-color';
import HowToPlayScreen from './screens/how-to-play';
import getRandomColor from './components/random-color';
import { Ionicons } from '@expo/vector-icons';

global.currentColor = getRandomColor();
global.darkColor = '#14181c';

const CardStackNavigator = createAppContainer(
  createStackNavigator({
    Main: {
      screen: MainScreen,

      navigationOptions: ({ navigation }) => ({
        title:
          (navigation.state.params || {}).currentRound == 6
            ? 'Summary'
            : `Round ${(navigation.state.params || {}).currentRound || 1}/5`,
        headerStyle: {
          backgroundColor: (navigation.state.params || {}).currentColor || '#' + global.currentColor
        },
        headerTitleStyle: {
          color: isDarkColor((navigation.state.params || {}).currentColor || '#' + global.currentColor)
            ? '#fff'
            : '#14181c',
          fontWeight: '500'
        }
      })
    }
  })
);

const ModalStackNavigator = createAppContainer(
  createStackNavigator(
    {
      CardStackNavigator: {
        screen: CardStackNavigator,
        navigationOptions: {
          header: null
        }
      },
      HowToPlay: {
        screen: HowToPlayScreen,
        navigationOptions: {
          title: 'How To Play'
        }
      }
    },
    {
      mode: 'modal',
      defaultNavigationOptions: {
        headerLeft: null,
        headerRight: (
          <View style={{ padding: 20 }}>
            <Ionicons name="md-close" size={23} />
          </View>
        )
      }
    }
  )
);

export default class App extends Component {
  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  render() {
    return <ModalStackNavigator />;
  }
}
