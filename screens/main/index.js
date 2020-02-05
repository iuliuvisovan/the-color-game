import isDarkColor from 'is-dark-color';
import React, { Component } from 'react';
import { View, Text, LayoutAnimation, Alert, TouchableOpacity, StatusBar } from 'react-native';
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
    summary: [],
    currentRoundPoints: 0
  };

  componentDidMount() {
    this.doInitialAnimation();
    this.props.navigation.navigate('HowToPlay');
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
    }, 500);

    if (guessedValues.length == 3) {
      this.setState({ showFinalResult: true });
    }
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
    if (key == 'Next round' || key == 'GG') {
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
    const { currentColor, currentRoundPoints, shadesAway, guessedValues, currentRound, summary } = this.state;
    this.setState({
      summary: [
        ...summary,
        {
          actualValue: currentColor,
          guessedValue: guessedValues[2],
          shadesAway,
          points: currentRoundPoints
        }
      ]
    });

    if (currentRound == 5) {
      this.props.navigation.setParams({ currentColor: '#ffffff', currentRound: 6 });
      this.setState({ showSummary: true });
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
    <View style={[styles.contentWrapper, { justifyContent: 'space-around', paddingBottom: 25 }]}>
      <View>
        {this.state.summary.map(({ guessedValue, actualValue, shadesAway, points }, i) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <View style={styles.roundNumber}>
              <Text>{i + 1}</Text>
            </View>
            <View
              key={i}
              style={[
                styles.summaryGuess,
                { backgroundColor: '#' + guessedValue, borderBottomRightRadius: 0, borderTopRightRadius: 0 }
              ]}
            >
              <Text style={{ color: getTextColorByBackground(guessedValue) }}>#{guessedValue}</Text>
            </View>
            <View
              key={i}
              style={[
                styles.summaryGuess,
                {
                  backgroundColor: '#' + actualValue,
                  marginLeft: -1,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0
                }
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  marginBottom: -16,
                  color: getTextColorByBackground(actualValue)
                }}
              >
                Actually:
              </Text>
              <Text style={[styles.guessTitle, { color: getTextColorByBackground(actualValue) }]}>
                {'\n'} #{actualValue}
              </Text>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 16,
                marginRight: -16
              }}
            >
              <Text style={{ color: global.darkColor, fontSize: 16 }}>Points: {points}</Text>
              <Text style={{ color: global.darkColor, fontSize: 12 }}>{shadesAway} shades away</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>Final score:</Text>
        <Text style={{ fontSize: 40 }}>{this.state.summary.map(x => x.points).reduce((a, b) => a + b)}</Text>
      </View>
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
      summary,
      showSummary
    } = this.state;

    if (showSummary) {
      return this.renderFinalScreen();
    }

    const textColor = isDarkColor('#' + currentColor || '#ffffff') ? '#fff' : '#14181c';

    return (
      <View style={[styles.wrapper, { backgroundColor: '#' + currentColor }]}>
        {/* <Text style={{ position: 'absolute', top: 15, left: 15 }}>{currentColor}</Text> */}
        <StatusBar barStyle={isDarkColor(currentColor || '#ffffff') ? 'light-content' : 'dark-content'} />
        <View style={styles.contentWrapper}>
          {guessedValues.length == 0 && (
            <View style={styles.changeColorButton}>
              <TouchableOpacity onPress={this.changeColor} style={{ padding: 25, margin: -25 }}>
                <Text style={styles.changeColorText}>↻</Text>
              </TouchableOpacity>
            </View>
          )}
          {showsQuestion && (
            <Text
              style={[
                styles.title,
                {
                  color: textColor,
                  fontSize: guessedValues.length > 0 ? 14 : 25,
                  marginTop: guessedValues.length > 0 ? -25 : 0
                }
              ]}
            >
              What color is this?
            </Text>
          )}
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
                        marginBottom: -16,
                        color: isDarkColor(x || '#ffffff') ? '#fff' : global.darkColor
                      },
                      guessedValues.length > i + 1 ? { fontSize: 12 } : {}
                    ]}
                  >
                    Guess #{i + 1}:
                  </Text>
                  <Text
                    style={[
                      styles.guessTitle,
                      { color: isDarkColor('#' + x || '#ffffff') ? '#fff' : global.darkColor },
                      guessedValues.length > i + 1 ? { fontSize: 12 } : {}
                    ]}
                  >
                    {'\n'} #{x}
                  </Text>
                </View>
              ))}
              {showGuessResult && (
                <>
                  <Text style={[styles.guessDescription, { color: textColor }]}>
                    {this.getTextForGuess()}{' '}
                    {showFinalResult &&
                      `You got ${currentRoundPoints} point${currentRoundPoints != 1 ? 's' : ''} for this round.`}
                  </Text>
                </>
              )}
              {!showFinalResult && (
                <View style={styles.inputWrapper}>
                  <Text style={{ color: textColor, fontSize: 18, marginRight: 4, marginLeft: -12 }}>#</Text>
                  <View style={styles.input} value={guessingValue}>
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
            isInLastRound={summary.length == 4}
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

const getTextColorByBackground = backgroundColor => {
  return isDarkColor(backgroundColor || '#ffffff') ? '#fff' : global.darkColor;
};
