import { StyleSheet, Dimensions } from 'react-native';

export default StyleSheet.create({
  text: {
    color: '#14181c',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16
  },
  image: {
    marginLeft: -16,
    width: Dimensions.get('screen').width,
    resizeMode: 'contain'
  },
  banner: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
