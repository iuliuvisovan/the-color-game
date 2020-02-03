import { StyleSheet, Platform } from 'react-native';

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
    width: Platform.OS == 'ios' ? 140 : 100,
    borderRadius: 6,
    borderColor: '#fff',
    padding: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    overflow: 'hidden'
  },
  newGameButton: {
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    backgroundColor: '#fff',
    elevation: 5,
    shadowOpacity: 0.55,
    shadowOffset: {
      top: 5
    }
  },
  newGameButtonText: {
    fontSize: 16,
    color: '#14181c',
    fontWeight: '700'
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
  summaryGuess: {
    width: 100,
    height: 60,
    borderRadius: 6,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  guessDescription: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16
  },
  changeColorButton: {
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
    fontSize: Platform.OS == 'ios' ? 18 : 28,
    marginTop: Platform.OS == 'ios' ? -2 : -8,
    marginLeft: Platform.OS == 'ios' ? 1 : -3
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
  },
  roundNumber: {
    borderWidth: 1,
    borderColor: '#14181c44',
    width: 24,
    height: 24,
    marginRight: 8,
    borderRadius: 24 / 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
