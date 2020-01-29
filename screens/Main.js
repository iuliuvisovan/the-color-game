import isDarkColor from 'is-dark-color';
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  LayoutAnimation,
  UIManager,
  Alert,
  TouchableOpacity
} from 'react-native';
import styles from './styles';

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default class MainScreen extends Component {
  state = {
    currentColor: '#FFC107',
    guessingValue: '#FFC107',
    guessedValues: [],
    attempting: true,
    showGuessResult: false,
    currentRound: 1
  };

  componentDidMount() {
    UIManager.setLayoutAnimationEnabledExperimental(true);
    const currentColor = getRandomColor();
    this.setState({ currentColor });
    this.props.navigation.setParams({ currentColor });
  }

  changeColor = () => {
    const currentColor = getRandomColor();
    this.setState({ currentColor });
    this.props.navigation.setParams({ currentColor });
  };

  guess = () => {
    const { guessingValue, guessedValues } = this.state;
    if (!guessingValue.includes('#') || guessingValue.length != 7) {
      Alert.alert('Invalid hex length', 'Your color must be a 6-digit hexadecimal string.');
      return;
    }

    LayoutAnimation.easeInEaseOut();
    guessedValues.push(guessingValue);
    this.setState({ guessingValue: '#', attempting: false });

    if (guessedValues.length == 3) {
      this.setState({ showFinalResult: true });
    } else {
      setTimeout(() => {
        LayoutAnimation.easeInEaseOut();

        this.setState({ showGuessResult: true });
      }, 2000);
    }
  };

  newAttempt = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ attempting: true, showGuessResult: false });
    setTimeout(() => {
      this.input.focus();
    }, 0);
  };

  render() {
    const { guessingValue, guessedValues, attempting, showGuessResult, currentColor, showFinalResult } = this.state;
    const textColor = isDarkColor(currentColor || '#ffffff') ? '#fff' : '#444';

    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={64}
        style={[styles.wrapper, { backgroundColor: currentColor }]}
      >
        {guessedValues.length == 0 && (
          <TouchableOpacity onPress={this.changeColor} style={styles.changeColor}>
            <Text style={[styles.changeColorText, { color: currentColor }]}>↻</Text>
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: textColor }]}>What color is this?</Text>
        {guessedValues.map((x, i) => (
          <View style={[styles.guess, { backgroundColor: x }]}>
            <Text style={[styles.guessTitle, { fontSize: 14, marginBottom: -20 }]}>Guess #{i + 1}</Text>
            <Text style={styles.guessTitle}>
              {'\n'} {x}
            </Text>
          </View>
        ))}
        {attempting && (
          <TextInput
            ref={x => (this.input = x)}
            style={[styles.input, { borderColor: textColor, color: textColor }]}
            value={guessingValue}
            onChangeText={text => {
              let formattedText = text.toUpperCase();
              if (!formattedText.includes('#')) {
                formattedText = '#' + formattedText;
              }
              this.setState({ guessingValue: formattedText });
            }}
          />
        )}
        {Boolean(guessingValue.length > 1) && (
          <TouchableOpacity
            onPress={this.guess}
            style={[styles.guessButton, { borderColor: textColor, backgroundColor: textColor + '2' }]}
          >
            <Text style={[styles.guessButtonText, { color: textColor }]}>GUESS!</Text>
          </TouchableOpacity>
        )}
        {showGuessResult && !showFinalResult && (
          <>
            <Text style={styles.guessDescription}>
              Ouch. That was pretty bad. You're 243 shades away.{'\n'} Give it another shot.
            </Text>
            <TouchableOpacity onPress={this.newAttempt} style={styles.guessButton}>
              <Text style={styles.guessButtonText}>Attempt #{guessedValues.length + 1}</Text>
            </TouchableOpacity>
          </>
        )}
        {showFinalResult && !showFinalResult && (
          <>
            <Text style={styles.guessDescription}>You got 313 points for this round.</Text>
            <TouchableOpacity onPress={this.newAttempt} style={styles.guessButton}>
              <Text style={styles.guessButtonText}>Attempt #{guessedValues.length + 1}</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    );
  }
}
