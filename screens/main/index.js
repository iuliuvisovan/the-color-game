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
import HexKeyboard from '../../components/hex-keyboard';
import Blinker from '../../components/blinker';

const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const darkColor = '#14181c';

export default class MainScreen extends Component {
  state = {
    guessedValues: [],
    guessingValue: '#',
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
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 6), 16);

    return { r, g, b };
  };

  getPointsForDistance = distance => {
    if (distance < 50) {
      return 5;
    } else if (distance < 100) {
      return 4;
    } else if (distance < 250) {
      return 3;
    } else if (distance < 500) {
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
      5: (hasAnotherGo ? `Incredible!!` : `Niice!`) + `Your guess is ${shadesAway} shades away from the actual color.`,
      4: `Congrats! Your guess is ${shadesAway} shades away from the actual color.`,
      3: `Nice! You got to ${shadesAway} shades away from the actual color.`,
      2: `You're ${shadesAway} shades from the actual color.`,
      1: `You're ${shadesAway} shades away from the actual color.`
    };

    let extraShotsText = hasAnotherGo ? (points > 3 ? ' Keep it up!' : ' Give it another shot.') : '';

    if (guessedValues.length == 2) {
      extraShotsText = ' One more try.';
    }

    return pointTexts[points] + extraShotsText;
  };

  newAttempt = () => {
    LayoutAnimation.easeInEaseOut();
    this.setState({ attempting: true, showGuessResult: false });
  };

  handleKeyPress = key => {
    const { guessingValue } = this.state;
    if (key == '⌫') {
      if (guessingValue == '#') {
        return;
      }
      this.setState({ guessingValue: guessingValue.substr(0, guessingValue.length - 1) });
      return;
    }
    if (key == 'Guess!') {
      this.guess();
      return;
    }

    let formattedText = guessingValue.toUpperCase();
    if (!formattedText.includes('#')) {
      formattedText = '#' + formattedText;
    }

    if (formattedText.length == 7) {
      return;
    }
    this.setState({ guessingValue: formattedText + key });
  };

  render() {
    const { guessingValue, guessedValues, showGuessResult, currentColor, showFinalResult, points } = this.state;
    const textColor = isDarkColor(currentColor || '#ffffff') ? '#fff' : '#14181c';

    return (
      <View style={[styles.wrapper, { backgroundColor: currentColor }]}>
        <View style={styles.contentWrapper}>
          {guessedValues.length == 0 && (
            <TouchableOpacity onPress={this.changeColor} style={styles.changeColor}>
              <Text style={[styles.changeColorText, { color: currentColor }]}>↻</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: textColor }]}>What color is this?</Text>
          {guessedValues.map((x, i) => (
            <View
              style={[
                styles.guess,
                { backgroundColor: x },
                guessedValues.length > i + 1 ? { width: 100, height: 60 } : {}
              ]}
            >
              <Text
                style={[
                  styles.guessTitle,
                  { fontSize: 14, marginBottom: -20, color: isDarkColor(x || '#ffffff') ? '#fff' : darkColor }
                ]}
              >
                Guess #{i + 1}
              </Text>
              <Text style={[styles.guessTitle, { color: isDarkColor(x || '#ffffff') ? '#fff' : darkColor }]}>
                {'\n'} {x}
              </Text>
            </View>
          ))}
          {showGuessResult && (
            <>
              <Text style={[styles.guessDescription, { color: textColor }]}>
                {this.getTextForGuess()} {showFinalResult && `You got ${points} points for this round.`}
              </Text>
            </>
          )}
          {!showFinalResult && (
            <View style={[styles.input, { borderColor: textColor, color: textColor }]} value={guessingValue}>
              <Text style={{ color: textColor, fontSize: 18 }}>{guessingValue}</Text>
              <Blinker color={textColor} />
            </View>
          )}
        </View>
        <HexKeyboard disabled={showFinalResult} showsNextButton={showFinalResult} onKeyPress={this.handleKeyPress} />
      </View>
    );
  }
}
