import { StyleSheet, Dimensions } from 'react-native';

const buttonWidth = Dimensions.get('screen').width / 7 - 6;

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    paddingBottom: 6,
    justifyContent: 'center'
  },
  button: {
    width: buttonWidth,
    height: 50,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 2
  },
  buttonText: {
    fontSize: 24,
    color: '#fff'
  },
  bigButton: {
    width: buttonWidth * 2 + 2
  },
  arrow: {
    position: 'absolute',
    top: -25,
    left: Dimensions.get('screen').width / 2 - 8
  }
});
