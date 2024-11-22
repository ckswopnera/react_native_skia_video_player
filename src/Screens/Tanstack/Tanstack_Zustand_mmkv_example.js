import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {darkTheme, lightTheme} from '../../Style/theme';
import {singleQuery} from '../../utils/util';
import {useNavigation} from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import {useBoundStore} from '../../store/MainStore';

export default function Tanstack_Zustand_mmkv_example() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const blinkOpacity = useSharedValue(0);
  const navigation = useNavigation();
  const {count, clearToken, setData, increment, decrement} = useBoundStore();
  const [isAtTop, setIsAtTop] = useState(true);
  const {isLoading, error, data, isRefetching, isFetching} = useQuery({
    queryKey: ['repoData', count],
    queryFn: () => singleQuery(count),
    staleTime: 2000,
  });

  useEffect(() => {
    const animation = () => {
      if (!isRefetching) {
        blinkOpacity.value = withRepeat(
          withTiming(1, {duration: 500, easing: Easing.linear}),
          -1,
          true,
        );
      } else {
        blinkOpacity.value = withTiming(0, {duration: 1000});
      }
    };
    animation();
  }, [isRefetching, blinkOpacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: blinkOpacity.value,
    };
  });

  const handleToggleIncrease = () => {
    increment();
  };
  const handleToggleDecrease = () => {
    decrement();
  };

  if (error)
    return (
      <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Text style={[styles.text, {color: theme.textColor}]}>
          An error has occurred
        </Text>
      </View>
    );

  const fadeIn = {
    from: { opacity: 0, transform: [{ translateY: 500 }] },
    to: { opacity: 1, transform: [{ translateY: 0 }] },
  };

  const fromLeft = {
    0: { opacity: 0, transform: [{ translateX: -500 }] },
    1: { opacity: 1, transform: [{ translateX: 0 }] },
  };

  const fromRight = {
    0: { opacity: 0, transform: [{ translateX: 500 }] },
    1: { opacity: 1, transform: [{ translateX: 0 }] },
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.backgroundColor}]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <Animatable.View animation={index % 2 === 0 ? fromLeft : fromRight} style={styles.itemContainer}>
            <Animated.View style={[styles.blinker, animatedStyle, { backgroundColor: 'lightgreen' }]}>
              <Text style={[styles.text, { color: theme.textColor, fontWeight: 'bold' }]}>
                {item?.id}
              </Text>
            </Animated.View>
            <View style={styles.itemTextContainer}>
              <Text style={[styles.text, { color: theme.textColor, fontWeight: 'bold' }]}>{item?.name}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.phone}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.email}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.website}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.address.city}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.address.street}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.address.suite}</Text>
              <Text style={[styles.text, { color: theme.textColor }]}>{item?.address.zipcode}</Text>
            </View>
          </Animatable.View>
        )}
        ListFooterComponent={isFetching || isRefetching ? <ActivityIndicator size="large" color={theme.textColor} /> : null}
      />
      <View style={styles.bottomControls}>
        <Animatable.View animation={fromLeft}>
          <TouchableOpacity style={styles.incrementButton} onPress={handleToggleIncrease}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </Animatable.View>
        <Animatable.View animation={fromRight}>
          <TouchableOpacity style={[styles.decrementButton, { backgroundColor: theme.buttonColor }]} onPress={handleToggleDecrease}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
      <Animatable.View animation={fadeIn} style={styles.footerContainer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('CachePage')}>
          <Text style={styles.footerButtonText}>Cache Page</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={clearToken}>
          <Text style={styles.footerButtonText}>Clear Token</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    paddingVertical: 2,
  },
  blinker: {
    height: 35,
    width: 35,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    margin: 4,
    padding: 8,
    flexDirection: 'row',
  },
  itemTextContainer: {
    marginHorizontal: 8,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  incrementButton: {
    width: 80,
    height: 80,
    marginHorizontal: 20,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 40,
    justifyContent: 'center',
  },
  decrementButton: {
    width: 80,
    height: 80,
    padding: 10,
    borderRadius: 40,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 23,
    transform: [{ scale: 1.5 }],
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
  footerButton: {
    width: '40%',
    backgroundColor: 'red',
    marginHorizontal: 4,
    borderRadius: 14,
    alignSelf: 'center',
  },
  footerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
