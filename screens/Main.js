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
    guessedValues: [],
    guessingValue: '#FFC107',
    currentColor: '#FFC107',
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

  getDistanceForGuess = (guessedValue, actualValue) => {
    const guessedRgb = this.getRgbIntsForHex(guessedValue.substr(1));
    const actualRgb = this.getRgbIntsForHex(actualValue.substr(1));

    const redDifference = Math.abs(actualRgb.r - guessedRgb.r);
    const greenDifference = Math.abs(actualRgb.g - guessedRgb.g);
    const blueDifference = Math.abs(actualRgb.b - guessedRgb.b);

    const distance = redDifference + greenDifference + blueDifference;

    return distance;
  };

  getRgbIntsForHex = hex => {
    const r = parseInt(hex.substr(1, 3), 16);
    const g = parseInt(hex.substr(3, 5), 16);
    const b = parseInt(hex.substr(5, 7), 16);

    return { r, g, b };
  };

  getPointsForDistance = distance => {
    if (distance < 500) {
      return 5;
    } else if (distance < 1000) {
      return 4;
    } else if (distance < 1500) {
      return 3;
    } else if (distance < 3000) {
      return 2;
    }

    return 1;
  };

  guess = () => {
    const { guessingValue, guessedValues, currentColor } = this.state;
    if (!guessingValue.includes('#') || guessingValue.length != 7) {
      Alert.alert('Invalid hex length', 'Your color must be a 6-digit hexadecimal string.');
      return;
    }

    LayoutAnimation.easeInEaseOut();
    guessedValues.push(guessingValue);
    const shadesAway = this.getDistanceForGuess(guessingValue, currentColor);
    const points = this.getPointsForDistance(shadesAway);

    this.setState({ guessingValue: '#', attempting: false, shadesAway, points });

    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();

      this.setState({ showGuessResult: true });
      if (guessedValues.length == 3) {
        this.setState({ showFinalResult: true });
      }
    }, 500);
  };

  getTextForGuess = () => {
    const { shadesAway, points, guessedValues } = this.state;

    const hasAnotherGo = guessedValues.length < 3;

    const pointTexts = {
      5: `Incredible!! Your guess is ${shadesAway} shades away from the actual color.`,
      4: `Congrats! Your guess is ${shadesAway} shades away from the actual color.`,
      3: `Nice! You got to ${shadesAway} shades away from the actual color.`,
      2: `You're ${shadesAway} shades from the actual color.`,
      1: `You're ${shadesAway} shades away from the actual color.`
    };

    return pointTexts[points] + (hasAnotherGo ? (points > 3 ? 'Keep it up!' : ' Give it another shot.') : '');
  };

  newAttempt = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ attempting: true, showGuessResult: false });
    setTimeout(() => {
      this.input.focus();
    }, 0);
  };

  render() {
    const {
      guessingValue,
      guessedValues,
      attempting,
      showGuessResult,
      currentColor,
      showFinalResult,
      points
    } = this.state;
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
        {showGuessResult && (
          <>
            <Text style={styles.guessDescription}>{this.getTextForGuess()}</Text>
            {!showFinalResult && (
              <TouchableOpacity onPress={this.newAttempt} style={styles.guessButton}>
                <Text style={styles.guessButtonText}>Attempt #{guessedValues.length + 1}</Text>
              </TouchableOpacity>
            )}
          </>
        )}
        {showFinalResult && (
          <>
            <Text style={styles.guessDescription}>You got {points} points for this round.</Text>
            <TouchableOpacity onPress={this.newAttempt} style={styles.guessButton}>
              <Text style={styles.guessButtonText}>Next round</Text>
            </TouchableOpacity>
          </>
        )}
      </KeyboardAvoidingView>
    );
  }
}
