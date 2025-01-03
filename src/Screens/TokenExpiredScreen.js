import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {toast_error, tokenCheck, windowWidth} from '../utils/util';
import * as Animatable from 'react-native-animatable';
import { useBoundStore } from '../store/MainStore';

const ErrorPage = () => {
  const bounceValue = useSharedValue(0);

  const setToken = useBoundStore(state => state.setToken);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(0.5 + bounceValue.value, {
            damping: 2,
            stiffness: 80,
            mass: 0.5,
          }),
        },
      ],
    };
  });

  React.useEffect(() => {
    const startAnimation = () => {
      bounceValue.value = 1;
    };
    startAnimation();
  }, [bounceValue]);

  const restoreToken = () => {
    const fetchToken = async () => {
      try {
        const data = await tokenCheck();
        setToken(data.accessToken);
        console.log(data);
      } catch (error) {
        console.log('Error fetching token:', error);
        toast_error('Error!', 'Error fetching token:');

      }
    };

    fetchToken();
  };
  const fromRight = {
    0: {
      opacity: 1,
      scale: 1,
      translateY: 200,
    },
    0.5: {
      opacity: 1,
      scale: 0.3,
      translateY: 0,
    },
    0.7: {
      opacity: 0,
      scale: 0,
      translateY: 0,
    },
    1: {
      opacity: 1,
      scale: 1,
      translateY: 0,
    },
  };
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.errorBox, animatedStyle]}>
        <Image
          source={require('../Assets/images/detective_search.png')}
          style={styles.errorIcon}
        />
        <Text style={styles.errorMessage}>Token Expired!</Text>
        <Text style={styles.errorDetails}>Please reload the app.</Text>
      </Animated.View>
      <Animatable.View
        animation={fromRight}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
        }}>
        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            marginHorizontal: 20,
            backgroundColor: 'red',
            padding: 10,
            borderRadius: 40,
            // alignSelf: 'center',
            justifyContent: 'center',
          }}
          onPress={restoreToken}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 23,
            }}>
            Start
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  errorBox: {
    width: windowWidth / 2,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  errorIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 5,
  },
  errorDetails: {
    fontSize: 12,
    color: '#721c24',
  },
});

export default ErrorPage;
