import React, { Component } from 'react';
import { View } from 'react-native';
import styles from './styles';

export default class HexKeyboard extends Component {
  state = {
    isVisible: false
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({ isVisible: !this.state.isVisible });
    }, 800);
  }

  render() {
    const { color } = this.props;
    const { isVisible } = this.state;

    return <View style={[styles.blinker, { borderColor: color, opacity: isVisible ? 1 : 0 }]} />;
  }
}
