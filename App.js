import { createStackNavigator } from 'react-navigation-stack';
import MainScreen from './screens/Main';
import { createAppContainer } from 'react-navigation';
import isDarkColor from 'is-dark-color';

export default createAppContainer(
  createStackNavigator({
    // For each screen that you can navigate to, create a new entry like this:
    Main: {
      // `ProfileScreen` is a React component that will be the main content of the screen.
      screen: MainScreen,

      // Optional: Override the `navigationOptions` for the screen
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
