import isDarkColor from 'is-dark-color';
import React, { Component } from 'react';
import { View, Text, LayoutAnimation, Alert, TouchableOpacity } from 'react-native';
import styles from './styles';
import HexKeyboard from '../../components/hex-keyboard';
import Blinker from '../../components/blinker';
import getRandomColor from '../../components/random-color';

export default class MainScreen extends Component {
  state = {
    guessedValues: [],
    guessingValue: '',
    attempting: true,
    showGuessResult: false,
    currentRound: 1,
    currentColor: global.currentColor,
    showsQuestion: false,
    showsUIElements: false
  };

  componentDidMount() {
    setTimeout(
      () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ showsQuestion: true });
        setTimeout(
          () => {
            LayoutAnimation.easeInEaseOut();
            this.setState({ showsUIElements: true });
          },
          __DEV__ ? 100 : 1500
        );
      },
      __DEV__ ? 100 : 1000
    );
  }

  changeColor = () => {
    const currentColor = getRandomColor();
    this.setState({ currentColor });
    this.props.navigation.setParams({ currentColor: '#' + currentColor });
  };

  getDistanceForGuess = (guessedValue, actualValue) => {
    const guessedRgb = this.getRgbIntsForHex(guessedValue);
    const actualRgb = this.getRgbIntsForHex(actualValue);

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
    if (distance < 30) {
      return 5;
    } else if (distance < 60) {
      return 4;
    } else if (distance < 100) {
      return 3;
    } else if (distance < 150) {
      return 2;
    }

    return 1;
  };

  guess = () => {
    const { guessingValue, guessedValues, currentColor } = this.state;
    if (guessingValue.length != 6) {
      Alert.alert('Invalid hex length', 'Your color must be a 6-digit hexadecimal string.');
      return;
    }

    LayoutAnimation.easeInEaseOut();
    guessedValues.push(guessingValue);

    const shadesAway = this.getDistanceForGuess(guessingValue, currentColor);
    const points = this.getPointsForDistance(shadesAway);

    this.setState({ guessingValue: '', attempting: false, shadesAway, points });

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
      5: (hasAnotherGo ? `Incredible!!` : `Niice!`) + ` Your guess is ${shadesAway} shades away from the actual color.`,
      4: `Congrats! Your guess is ${shadesAway} shades away from the actual color.`,
      3: `You're ${shadesAway} shades away from the actual color.`,
      2: `You're ${shadesAway} shades away from the actual color.`,
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
      if (guessingValue.length == 0) {
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

    if (formattedText.length == 6) {
      return;
    }
    this.setState({ guessingValue: formattedText + key });
  };

  render() {
    const {
      guessingValue,
      guessedValues,
      showGuessResult,
      currentColor,
      showFinalResult,
      showsQuestion,
      showsUIElements,
      points
    } = this.state;
    const textColor = isDarkColor(currentColor || '#ffffff') ? '#fff' : '#14181c';

    return (
      <View style={[styles.wrapper, { backgroundColor: '#' + currentColor }]}>
        <View style={styles.contentWrapper}>
          {guessedValues.length == 0 && (
            <TouchableOpacity onPress={this.changeColor} style={styles.changeColor}>
              <Text style={[styles.changeColorText, { color: currentColor }]}>↻</Text>
            </TouchableOpacity>
          )}
          {showsQuestion && <Text style={[styles.title, { color: textColor }]}>What color is this?</Text>}
          {showsUIElements && (
            <>
              {guessedValues.map((x, i) => (
                <View
                  key={i}
                  style={[
                    styles.guess,
                    { backgroundColor: '#' + x },
                    guessedValues.length > i + 1 ? { width: 100, height: 60 } : {}
                  ]}
                >
                  <Text
                    style={[
                      styles.guessTitle,
                      {
                        fontSize: 14,
                        marginBottom: -20,
                        color: isDarkColor(x || '#ffffff') ? '#fff' : global.darkColor
                      }
                    ]}
                  >
                    Guess #{i + 1}:
                  </Text>
                  <Text
                    style={[
                      styles.guessTitle,
                      { color: isDarkColor('#' + x || '#ffffff') ? '#fff' : global.darkColor }
                    ]}
                  >
                    {'\n'} #{x}
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
                <View style={styles.inputWrapper}>
                  <Text style={{ color: textColor, fontSize: 18, marginRight: 4, marginLeft: -12 }}>#</Text>
                  <View
                    style={[styles.input, { borderColor: textColor + '44', color: textColor }]}
                    value={guessingValue}
                  >
                    <Text style={{ color: global.darkColor, fontSize: 18, letterSpacing: 2 }}>{guessingValue}</Text>
                    <Blinker color={'#f00'} />
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        {showsUIElements && (
          <HexKeyboard
            color={'#f00'}
            disabled={showFinalResult}
            showsNextButton={showFinalResult}
            onKeyPress={this.handleKeyPress}
          />
        )}
      </View>
    );
  }
}
