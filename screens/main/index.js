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
    showFinalResult: false,
    currentRound: 1,
    currentColor: global.currentColor,
    showsQuestion: false,
    showsUIElements: false,
    allRoundsPoints: [],
    currentRoundPoints: 0
  };

  componentDidMount() {
    this.doInitialAnimation();
  }

  doInitialAnimation = () => {
    const inDevelopment = false;
    setTimeout(
      () => {
        LayoutAnimation.easeInEaseOut();
        this.setState({ showsQuestion: true });
        setTimeout(
          () => {
            LayoutAnimation.easeInEaseOut();
            this.setState({ showsUIElements: true });
          },
          inDevelopment ? 100 : 1500
        );
      },
      inDevelopment ? 100 : 1000
    );
  };

  changeColor = () => {
    const currentColor = getRandomColor();
    this.setState({ currentColor });
    this.props.navigation.setParams({ currentColor: '#' + currentColor });
  };

  guess = () => {
    const { guessingValue, guessedValues, currentColor } = this.state;
    if (guessingValue.length != 6) {
      Alert.alert('Invalid hex length', 'Your color must be a 6-digit hexadecimal string.');
      return;
    }

    LayoutAnimation.easeInEaseOut();
    guessedValues.push(guessingValue);

    const shadesAway = getDistanceForGuess(guessingValue, currentColor);
    const currentRoundPoints = getPointsForDistance(shadesAway);

    this.setState({ guessingValue: '', attempting: false, shadesAway, currentRoundPoints });

    setTimeout(() => {
      LayoutAnimation.easeInEaseOut();

      this.setState({ showGuessResult: true });
      if (guessedValues.length == 3) {
        this.setState({ showFinalResult: true });
      }
    }, 500);
  };

  getTextForGuess = () => {
    const { shadesAway, currentRoundPoints, guessedValues } = this.state;

    const hasAnotherGo = guessedValues.length < 3;
    const fiveAndSix =
      (hasAnotherGo ? `Incredible!` : `Niice!`) +
      ` Your guess ${hasAnotherGo ? 'is' : 'was'} ${shadesAway} shades away from the actual color.`;

    const threeTwoOne = `You're ${shadesAway} shades away from the actual color.`;

    const pointTexts = {
      6: fiveAndSix,
      5: fiveAndSix,
      4: `Congrats! Your guess ${hasAnotherGo ? 'is' : 'was'} ${shadesAway} shades away from the actual color.`,
      3: threeTwoOne,
      2: threeTwoOne,
      1: threeTwoOne
    };

    let extraShotsText = hasAnotherGo ? (currentRoundPoints > 3 ? ' Keep it up!' : ' Give it another shot.') : '';

    if (guessedValues.length == 2) {
      extraShotsText = ' One more try.';
    }

    return pointTexts[currentRoundPoints] + extraShotsText;
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
    if (key == 'Next round') {
      this.goToNextRound();
      return;
    }

    let formattedText = guessingValue.toUpperCase();

    if (formattedText.length == 6) {
      return;
    }
    this.setState({ guessingValue: formattedText + key });
  };

  goToNextRound = () => {
    const { allRoundsPoints, currentRoundPoints, currentRound } = this.state;
    this.setState({ allRoundsPoints: [...allRoundsPoints, currentRoundPoints] });

    if (currentRound == 5) {
      this.setState({ showFinalScreen: true });
      return;
    }

    const newColor = getRandomColor();
    LayoutAnimation.easeInEaseOut();
    this.setState({
      guessedValues: [],
      guessingValue: '',
      currentColor: newColor,
      showsUIElements: false,
      showsQuestion: false,
      shadesAway: 0,
      currentRoundPoints: 0,
      showGuessResult: false,
      guessingValue: '',
      guessedValues: [],
      showFinalResult: false,
      currentRound: currentRound + 1
    });
    this.props.navigation.setParams({
      currentRound: currentRound + 1,
      currentColor: '#' + newColor
    });
    this.doInitialAnimation();
  };

  renderFinalScreen = () => (
    <View style={styles.contentWrapper}>
      <Text style={{ fontSize: 20 }}>Final score:</Text>
      <Text style={{ fontSize: 40 }}>24</Text>
      <TouchableOpacity style={styles.newGameButton}>
        <Text style={styles.newGameButtonText}>NEW GAME</Text>
      </TouchableOpacity>
    </View>
  );

  render() {
    const {
      guessingValue,
      guessedValues,
      showGuessResult,
      currentColor,
      showFinalResult,
      showsQuestion,
      showsUIElements,
      currentRoundPoints,
      showFinalScreen
    } = this.state;

    if (showFinalScreen) {
      return this.renderFinalScreen();
    }

    const textColor = isDarkColor(currentColor || '#ffffff') ? '#fff' : '#14181c';

    return (
      <View style={[styles.wrapper, { backgroundColor: '#' + currentColor }]}>
        <Text style={{ position: 'absolute', top: 15, left: 15 }}>{currentColor}</Text>
        <View style={styles.contentWrapper}>
          {guessedValues.length == 0 && (
            <TouchableOpacity onPress={this.changeColor} style={styles.changeColor}>
              <Text style={styles.changeColorText}>↻</Text>
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
                    {this.getTextForGuess()} {showFinalResult && `You got ${currentRoundPoints} points for this round.`}
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
                    <Text style={{ color: global.darkColor, fontSize: 18 }}>{guessingValue}</Text>
                    <Blinker />
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        {showsUIElements && (
          <HexKeyboard
            color={guessingValue.length < 2 ? '#f00' : guessingValue.length < 4 ? '#0f0' : '#00f'}
            hasFinishedWriting={guessingValue.length == 6}
            hasFinishedRound={showFinalResult}
            onKeyPress={this.handleKeyPress}
          />
        )}
      </View>
    );
  }
}

const getPointsForDistance = distance => {
  if (distance < 25) {
    return 6;
  } else if (distance < 30) {
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

const getDistanceForGuess = (guessedValue, actualValue) => {
  const guessedRgb = getRgbIntsForHex(guessedValue);
  const actualRgb = getRgbIntsForHex(actualValue);

  const redDifference = Math.abs(actualRgb.r - guessedRgb.r);
  const greenDifference = Math.abs(actualRgb.g - guessedRgb.g);
  const blueDifference = Math.abs(actualRgb.b - guessedRgb.b);

  const distance = redDifference + greenDifference + blueDifference;

  return distance;
};

const getRgbIntsForHex = hex => {
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 6), 16);

  return { r, g, b };
};
