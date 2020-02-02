import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#03A9F4',
    justifyContent: 'space-between'
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    flex: 1
  },
  title: {
    fontSize: 25,
    color: '#fff'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16
  },
  input: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 100,
    borderRadius: 6,
    borderColor: '#fff',
    borderWidth: 2,
    padding: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    overflow: 'hidden'
  },
  newGameButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderRadius: 24,
    marginTop: 75,
    borderWidth: 2,
    backgroundColor: '#14181c'
  },
  newGameButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700'
  },
  guessTitle: {
    color: '#fff',
    fontSize: 18
  },
  guess: {
    marginTop: 16,
    width: 160,
    height: 100,
    borderRadius: 6,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.8,
    borderColor: '#fff'
  },
  guessDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16
  },
  changeColor: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 25,
    height: 25,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 25 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    backgroundColor: '#fff'
  },
  changeColorText: {
    fontSize: 28,
    marginTop: -8,
    marginLeft: -3
  },
  colors: {
    position: 'absolute',
    top: 0,
    left: 7,
    flexDirection: 'row'
  },
  color: {
    width: 27,
    height: 50,
    opacity: 0.25
  }
});
