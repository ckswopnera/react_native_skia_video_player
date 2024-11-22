import React from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import data from './data';

const {width, height} = Dimensions.get('window');
const TICKER_HEIGHT = 40;
const LOGO_WIDTH = 220;
const LOGO_HEIGHT = 40;
const CIRCLE_SIZE = width * 0.6;
const DOT_SIZE = 40;

const Item = ({imageUri, heading, description, scrollX, index}) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
  const opacityInputRange = [
    (index - 0.4) * width,
    index * width,
    (index + 0.4) * width,
  ];

  const animatedImageStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollX.value, inputRange, [0.2, 1, 0.2]);
    return {
      transform: [{scale}],
    };
  });

  const animatedHeadingStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scrollX.value, inputRange, [
      width * 0.1,
      0,
      -width * 0.1,
    ]);
    const opacity = interpolate(scrollX.value, opacityInputRange, [0, 1, 0]);
    return {
      opacity,
      transform: [{translateX}],
    };
  });

  const animatedDescriptionStyle = useAnimatedStyle(() => {
    const translateX = interpolate(scrollX.value, inputRange, [
      width,
      0,
      -width,
    ]);
    const opacity = interpolate(scrollX.value, opacityInputRange, [0, 1, 0]);
    return {
      opacity,
      transform: [{translateX}],
    };
  });

  return (
    <View style={styles.itemStyle}>
      <Animated.Image
        source={imageUri}
        style={[styles.imageStyle, animatedImageStyle]}
      />
      <View style={styles.textContainer}>
        <Animated.Text style={[styles.heading, animatedHeadingStyle]}>
          {heading}
        </Animated.Text>
        <Animated.Text style={[styles.description, animatedDescriptionStyle]}>
          {description}
        </Animated.Text>
      </View>
    </View>
  );
};

const Circle = ({scrollX}) => {
  return (
    <View style={[StyleSheet.absoluteFillObject, styles.circleContainer]}>
      {data.map((p, index) => {
        const inputRange = [
          (index - 0.55) * width,
          index * width,
          (index + 0.55) * width,
        ];

        const animatedCircleStyle = useAnimatedStyle(() => {
          const opacity = interpolate(scrollX.value, inputRange, [0, 0.1, 0]);
          const scale = interpolate(scrollX.value, inputRange, [0, 1, 0]);
          return {
            backgroundColor: p.color,
            opacity,
            transform: [{scale}],
          };
        });

        return (
          <Animated.View
            key={index}
            style={[styles.circle, animatedCircleStyle]}
          />
        );
      })}
    </View>
  );
};

const Ticker = ({scrollX}) => {
  const animatedTickerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      [-width * 2, -width, 0, width, width * 2],
      [TICKER_HEIGHT * 2, TICKER_HEIGHT, 0, -TICKER_HEIGHT, -TICKER_HEIGHT * 2],
    );
    return {
      transform: [{translateY}],
    };
  });

  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={animatedTickerStyle}>
        {data.map(({type}, index) => {
          return (
            <Text key={index} style={styles.ticker}>
              {type}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};

const Pagination = ({scrollX}) => {
  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      data.map((_, i) => i * width),
      data.map((_, i) => i * 40),
    );
    return {
      transform: [{translateX}],
    };
  });

  return (
    <View style={styles.pagination}>
      <Animated.View
        style={[
          styles.paginationIndicator,
          animatedIndicatorStyle,
          {
            borderColor: 'rgba(0,0,0,0.2)',
          },
        ]}
      />
      {data.map(item => {
        return (
          <View key={item.key} style={styles.paginationDotContainer}>
            <View
              style={[styles.paginationDot, {backgroundColor: item.dotBg}]}
            />
          </View>
        );
      })}
    </View>
  );
};

export default function Carousel() {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Circle scrollX={scrollX} />
      <Image style={styles.logo} source={require('./Assets/1.png')} />
      <Animated.FlatList
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        horizontal
        keyExtractor={item => item.key}
        onScroll={onScroll}
        data={data}
        renderItem={({item, index}) => (
          <Item {...item} index={index} scrollX={scrollX} />
        )}
      />
      <Pagination scrollX={scrollX} />
      <Ticker scrollX={scrollX} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },

  itemStyle: {
    width,
    height,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: width * 0.75,
    height: width * 0.75,
    resizeMode: 'contain',
    flex: 1,
  },
  textContainer: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flex: 0.55,
  },
  heading: {
    color: '#444',
    textTransform: 'uppercase',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontWeight: '600',
    textAlign: 'left',
    width: width * 0.75,
    marginRight: 10,
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },

  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: 'absolute',
    top: '20%',
  },
  ticker: {
    textTransform: 'uppercase',
    fontSize: TICKER_HEIGHT,
    lineHeight: TICKER_HEIGHT,
    fontWeight: '800',
    color: '#222',
  },
  tickerContainer: {
    height: TICKER_HEIGHT,
    overflow: 'hidden',
    position: 'absolute',
    top: 40,
    left: 20,
  },
  pagination: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    flexDirection: 'row',
    height: DOT_SIZE,
  },
  paginationDot: {
    width: DOT_SIZE * 0.3,
    height: DOT_SIZE * 0.3,
    borderRadius: DOT_SIZE * 0.15,
  },
  paginationDotContainer: {
    width: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationIndicator: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    position: 'absolute',
  },
  logo: {
    opacity: 0.9,
    height: LOGO_HEIGHT,
    width: LOGO_WIDTH,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
    bottom: 10,
    transform: [
      {translateX: -LOGO_WIDTH / 2},
      {translateY: -LOGO_HEIGHT / 2},
      {rotateZ: '-90deg'},
      {translateX: LOGO_WIDTH / 2},
      {translateY: LOGO_HEIGHT / 2},
    ],
  },
});
