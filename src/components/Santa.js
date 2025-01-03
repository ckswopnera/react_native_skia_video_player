import React, {useEffect} from 'react';
import {View, StyleSheet, Dimensions, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {windowWidth} from '../utils/util';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');

const Santa = () => {
  const santas = Array.from({length: 4}, () => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
  }));

  const createAnimatedStyle = (translateX, translateY) =>
    useAnimatedStyle(() => ({
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    }));

  const moveImage = (translateX, translateY) => {
    const randomX = Math.random() * (width - 100); // Image width is 100
    const randomY = Math.random() * (height - 100); // Image height is 100

    translateX.value = withTiming(randomX, {duration: 2000});
    translateY.value = withTiming(randomY, {duration: 2000});
  };

  useEffect(() => {
    const intervals = santas.map(({translateX, translateY}) => {
      const interval = setInterval(
        () => moveImage(translateX, translateY),
        2000,
      );
      return interval;
    });

    return () => intervals.forEach(interval => clearInterval(interval)); // Cleanup
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ff0000', '#ff8c00', '#ffff00']} 
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.gradient}>
        <Animated.Text
          style={[
            {
              color: '#fff',
              fontSize: 32,
              fontFamily: 'Inter-SemiBold',
              paddingHorizontal: 10,
              borderRadius: 10,
              textAlign:'center',
            },
            // useAnimatedStyle(() => ({
            //   transform: [{translateX: santas[0].translateX.value}],
            // })),
          ]}>
          Happy Christmas
        </Animated.Text>
      </LinearGradient>
      {santas.map(({translateX, translateY}, index) => {
        const animatedStyle = createAnimatedStyle(translateX, translateY);

        return (
          <Animated.Image
            key={index}
            source={require('../Assets/images/santa_claus.png')}
            style={[styles.image, animatedStyle]}
          />
        );
      })}
      <Image
        source={require('../Assets/images/tree.png')}
        style={{
          ...styles.image,
          bottom: 10,
          alignSelf: 'center',
          height: 500,
          width: windowWidth,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    // backgroundColor: '#87CEEB', // Optional background color
  },
  image: {
    width: 100,
    height: 100,
    position: 'absolute',
  },
});

export default Santa;
