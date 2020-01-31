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
  input: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'red',
    width: 120,
    borderRadius: 6,
    borderColor: '#fff',
    borderWidth: 2,
    padding: 8,
    paddingHorizontal: 12,
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  guessButton: {
    padding: 24,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 24,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#fff2'
  },
  guessButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '900'
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
  }
});
