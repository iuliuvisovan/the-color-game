import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

const isSpecialKey = key => {
  return key == '⌫' || key.length > 1;
};

export default class HexKeyboard extends Component {
  isEnabled = key => {
    const { hasFinishedRound, hasFinishedWriting } = this.props;
    if (hasFinishedRound) {
      return key.length > 1;
    }

    if (hasFinishedWriting) {
      return isSpecialKey(key);
    }

    return true;
  };

  render() {
    const { color, hasFinishedRound, hasFinishedWriting } = this.props;
    const guessButton = hasFinishedRound ? 'Next round' : 'Guess!';
    const keys = [1, 2, 3, 4, 5, '⌫', 6, 7, 8, 9, 0, guessButton, 'A', 'B', 'C', 'D', 'E', 'F'];

    return (
      <View style={styles.wrapper}>
        {!hasFinishedWriting && (
          <View style={styles.arrow}>
            <Text style={{ color, fontSize: 24, transform: [{ rotate: '-90deg' }] }}>›</Text>
          </View>
        )}
        {keys.map(key => (
          <TouchableOpacity onPress={() => this.props.onKeyPress(key)} activeOpacity={0.45} key={key}>
            <View
              style={[
                styles.button,
                isSpecialKey(key) ? styles.bigButton : {},
                { opacity: this.isEnabled(key) ? 1 : 0.4 }
              ]}
            >
              <Text style={[styles.buttonText, { color: '#fff', fontSize: key.length > 1 ? 18 : 24 }]}>{key}</Text>
            </View>
          </TouchableOpacity>
        ))}
        <LinearGradient
          colors={['#4440', '#4444']}
          style={{ position: 'absolute', zIndex: -1, bottom: 0, width: Dimensions.get('screen').width, height: '115%' }}
        />
      </View>
    );
  }
}
