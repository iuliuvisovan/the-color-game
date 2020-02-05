import React, { Component } from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import styles from './styles';
import NetherlandsImage from '../../assets/images/spring-netherlands.jpg';
import RgbLevelsImage from '../../assets/images/rgb-levels.png';
import SubtractiveAdditiveImage from '../../assets/images/subtractive-additive.png';
import AdditiveImage from '../../assets/images/additive.jpg';
import AdditiveColorsMixing from '../../assets/images/additive-colors-mixing.png';
import PurpleRedImage from '../../assets/images/purple-red.png';
import { ScrollView } from 'react-native-gesture-handler';

export default class HowToPlay extends Component {
  render() {
    return (
      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        <Image source={NetherlandsImage} style={[styles.image, { height: 180 }]} />
        <Text style={styles.text}>The world is made up of colors.</Text>
        <Text style={styles.text}>
          And they can be of two types:{'\n'}
          {'\n'}
          Subtractive, like the ones you learned when you mixed paint in primary school: {'\n'}
          {'\n'}Mixing blue and yellow gives you green; blue and red gives you purple; red and yellow gives you orange;
          and mixing all of them together, gives you black. These are called subtractive, because the more colors you
          have, the darker the resulting color gets.
        </Text>

        <Image source={SubtractiveAdditiveImage} style={[styles.image, { height: 170 }]} />

        <Text style={styles.text}>
          Additive colors is how screens and computers work. It's what you get when mixing multiple sources of light,
          e.g. the beams of different-colored flashlights.
        </Text>
        <Image source={AdditiveImage} style={[styles.image, { height: 170 }]} />

        <Text style={styles.text}>
          In computers, colors are made up 3 numbers that indicate how red, how green, and how blue that color is.
        </Text>
        <Image source={RgbLevelsImage} style={[styles.image, { height: 160 }]} />
        <Text style={styles.text}>
          If you want to represent the color purple, you'd say your color is half blue and half red, with no green. If
          you want red, you say your color is full red, no green, and no blue.
        </Text>
        <Image source={PurpleRedImage} style={[styles.image, { height: 160 }]} />
        <Text style={styles.text}>
          The numbers are represented in hexadecimal, and they go from 0 to 16, twice for each color. {'\n'}
          Hexadecimal is just a fancy way of saying "instead of 10, 11, 12, 13, 14, 15, 16 use A, B, C, D, E, F". So for
          each color, we'll be able to have a value ranging from 00, 01, 02, 03... 0d, 0e, 0f all the way up to fd, fe,
          ff.
        </Text>

        <Text style={styles.text}>Red is #ff0000. This is a color.</Text>
        <Text style={styles.text}>The 16.777.214 other are up to you to figure out. Good luck!</Text>
      </ScrollView>
    );
  }
}
