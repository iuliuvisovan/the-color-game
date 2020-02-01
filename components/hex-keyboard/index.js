import React, { Component } from 'react';
import { View, Text, Dimensions } from 'react-native';
import styles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

export default class HexKeyboard extends Component {
  render() {
    const { showsNextButton, color } = this.props;
    const guessButton = showsNextButton ? 'Next round' : 'Guess!';
    const keys = [1, 2, 3, 4, 5, '⌫', 6, 7, 8, 9, 0, guessButton, 'A', 'B', 'C', 'D', 'E', 'F'];

    return (
      <View style={styles.wrapper}>
        <View style={styles.arrow}>
          <Text style={{ color, fontSize: 24, transform: [{ rotate: '-90deg' }] }}>›</Text>
        </View>
        {keys.map(key => (
          <TouchableOpacity
            onPress={() => this.props.onKeyPress(key)}
            activeOpacity={0.45}
            key={key}
            style={[styles.button, key.length > 1 || key == '⌫' ? styles.bigButton : {}]}
          >
            <Text style={[styles.buttonText, { color: '#fff' }]}>{key}</Text>
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
