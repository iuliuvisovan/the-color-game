import { StyleSheet, Dimensions } from 'react-native';

const buttonWidth = Dimensions.get('screen').width / 6 - 5;

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8
  },
  button: {
    width: buttonWidth,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1
  },
  buttonText: {
    fontSize: 24,
    color: '#fff'
  },
  guessButton: {
    width: buttonWidth * 2 + 2
  }
});
