import {
  View,
  Text,
  Button,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useBoundStore} from '../store/MainStore';
import {useShallow, shallow} from 'zustand/react/shallow';
import {darkTheme, lightTheme} from '../Style/theme';
import * as Animatable from 'react-native-animatable';

export default function TestZustand() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const animatableTextBearRef = useRef(null);
  const animatableTextFishesRef = useRef(null);
  const animatableTextImmerRef = useRef(null);

  const {
    killBothAnimal,
    resetAllStores,
    bears,
    fishes,
    addBear,
    eatFish,
    addFish,
    killBear,
    lush,
    clearForest,
    clearForestImmer,
    addBearFish,
    getStorage,
  } = useBoundStore();

  // useEffect(() => {
  //   console.log('====================================');
  //   console.log(getStorage());
  //   console.log('====================================');
  // }, [bears]);
  const zoomIn = {
    0: {
      opacity: 0,
      transform: [
        {
          scale: 0,
        },
        {
          rotateX: '0deg',
        },
      ],
    },
    1: {
      opacity: 1,
      transform: [
        {
          scale: 1,
        },
        {
          rotateX: '-360deg',
        },
      ],
    },
  };

  return (
    <ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 32,
            textDecorationLine: 'underline',
            color: theme.textColor,
          }}>
          Bear
        </Text>
        <Text
          style={{
            fontSize: 32,
            textDecorationLine: 'underline',
            color: theme.textColor,
          }}>
          Fish
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Animatable.Text
          ref={animatableTextBearRef}
          style={{
            fontSize: 32,
            textAlign: 'center',
            color: theme.textColor,
          }}>
          {bears}
        </Animatable.Text>
        <Animatable.Text
          ref={animatableTextFishesRef}
          style={{
            textAlign: 'center',
            fontSize: 32,
            color: theme.textColor,
          }}>
          {fishes}
        </Animatable.Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          // height: '100%',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          // width: '45%',
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'grey',
            padding: 12,
            width: '40%',
            borderRadius: 10,
          }}
          onPress={() => {
            if (animatableTextBearRef.current) {
              animatableTextBearRef.current.animate(zoomIn);
            }
            addBear();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            add Bear 🐻
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'grey',
            padding: 12,
            width: '40%',
            borderRadius: 10,
          }}
          onPress={() => {
            if (animatableTextFishesRef.current) {
              animatableTextFishesRef.current.animate(zoomIn);
            }
            addFish();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            add Fish 🐟
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          // width: '45%',
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'grey',
            padding: 12,
            width: '40%',
            borderRadius: 10,
          }}
          onPress={() => {
            if (animatableTextBearRef.current) {
              animatableTextBearRef.current.animate(zoomIn);
            }
            killBear();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            kill Bear 🐻
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'grey',
            padding: 12,
            width: '40%',

            borderRadius: 10,
          }}
          onPress={() => {
            if (animatableTextFishesRef.current) {
              animatableTextFishesRef.current.animate(zoomIn);
            }
            eatFish();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            eat Fish 🐟
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          // width: '45%',
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 12,
            width: '40%',
            borderRadius: 10,
          }}
          onPress={() => {
            if (
              animatableTextBearRef.current &&
              animatableTextFishesRef.current
            ) {
              animatableTextBearRef.current.animate(zoomIn);
              animatableTextFishesRef.current.animate(zoomIn);
            }

            addBearFish();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            Add Both 🐟 🐻
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            padding: 12,
            width: '40%',
            borderRadius: 10,
          }}
          onPress={() => {
            if (
              animatableTextBearRef.current &&
              animatableTextFishesRef.current
            ) {
              animatableTextBearRef.current.animate(zoomIn);
              animatableTextFishesRef.current.animate(zoomIn);
            }
            killBothAnimal();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            kill Both 🐟 🐻
          </Text>
        </TouchableOpacity>
      </View>
      <Text
        style={{
          textAlign: 'center',
          textTransform: 'capitalize',
          fontSize: 23,
          color: theme.textColor,
          textDecorationLine: 'underline',
        }}>
        Immer Example
      </Text>
      <Animatable.Text
        ref={animatableTextImmerRef}
        style={{
          textAlign: 'center',
          textTransform: 'capitalize',
          fontSize: 53,
          color: theme.textColor,
        }}>
        {lush?.forest?.contains?.a}
      </Animatable.Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          // width: '45%',
          paddingVertical: 10,
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            padding: 12,
            width: '40%',

            borderRadius: 10,
          }}
          onPress={() => {
            if (animatableTextImmerRef.current) {
              animatableTextImmerRef.current.animate(zoomIn);
            }
            clearForest(1);
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            Nested Object Increase
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            padding: 12,
            width: '40%',

            borderRadius: 10,
          }}
          onPress={() => {
            if (animatableTextImmerRef.current) {
              animatableTextImmerRef.current.animate(zoomIn);
            }
            clearForestImmer(1);
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              textTransform: 'capitalize',
            }}>
            Nested Object Decrease
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
