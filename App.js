import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './screens/main';
import { createAppContainer } from 'react-navigation';
import isDarkColor from 'is-dark-color';

export default createAppContainer(
  createStackNavigator({
    Main: {
      screen: MainScreen,

      navigationOptions: ({ navigation }) => ({
        title: `Round ${(navigation.state.params || {}).currentRound || 1}/5`,
        headerStyle: {
          backgroundColor: (navigation.state.params || {}).currentColor
        },
        headerTitleStyle: {
          color: isDarkColor((navigation.state.params || {}).currentColor || '#ffffff') ? '#fff' : '#444',
          fontWeight: '500'
        }
      })
    }
  })
);
