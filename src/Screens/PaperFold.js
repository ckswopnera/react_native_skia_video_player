import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  Canvas,
  Image as SkImage,
  Skia,
  useImage,
} from '@shopify/react-native-skia';

const {width} = Dimensions.get('window');
const A4_WIDTH = width * 0.8;
const A4_HEIGHT = A4_WIDTH * 1.914;
const IMAGE_SOURCE = require('../Assets/images/article.png');

const PaperfoldAnimation = () => {
  const foldProgress = useSharedValue(0);
  const image = useImage(IMAGE_SOURCE);

  const toggleFold = () => {
    foldProgress.value = withTiming(foldProgress.value === 1 ? 0 : 1, {
      duration: 1000,
    });
  };

  const animatedStyle = index =>
    useAnimatedStyle(() => {
      const rotateX =
        foldProgress.value * 15 * (index === 0 ? -1.4 : index === 1 ? 2 : -1.4);
      const translateY = foldProgress.value * ((index * A4_HEIGHT) / 3);

      return {
        transform: [{translateY}, {rotateX: `${rotateX}deg`}],
        // zIndex: foldProgress.value === 1 ? 3 - index : 0,
        zIndex: index === 0 ? 3 : index === 1 ? 1 : -1,
        borderTopStartRadius: index === 0 ? 14 : 0,
        borderTopEndRadius: index === 0 ? 14 : 0,
        borderBottomStartRadius: index === 2 ? 14 : 0,
        borderBottomEndRadius: index === 2 ? 14 : 0,
      };
    });

  const createImageSection = (width, height, skiaImage, yOffset) => {
    return {
      skiaImage,
      yOffset,
    };
  };

  const imageSections = [
    createImageSection(A4_WIDTH, A4_HEIGHT / 3, image, 0),
    createImageSection(A4_WIDTH, A4_HEIGHT / 3, image, A4_HEIGHT / 3),
    createImageSection(A4_WIDTH, A4_HEIGHT / 3, image, (2 * A4_HEIGHT) / 3),
  ];

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={toggleFold}>
        <View style={styles.paperContainer}>
          {imageSections.map((section, index) => (
            <Animated.View
              key={index}
              style={[styles.foldedSection, animatedStyle(index)]}>
              <Canvas style={{width: A4_WIDTH, height: A4_HEIGHT / 3}}>
                {image && (
                  <SkImage
                    image={section.skiaImage}
                    rect={{
                      x: 0,
                      y: section.yOffset,
                      width: A4_WIDTH,
                      height: A4_HEIGHT / 3,
                    }}
                    fit={'fitWidth'}
                  />
                )}
              </Canvas>
            </Animated.View>
          ))}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  paperContainer: {
    width: A4_WIDTH,
    height: A4_HEIGHT,
    position: 'relative',
  },
  foldedSection: {
    position: 'absolute',
    width: A4_WIDTH,
    height: A4_HEIGHT / 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
});

export default PaperfoldAnimation;
