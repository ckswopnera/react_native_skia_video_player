import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  useColorScheme,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import {darkTheme, lightTheme} from '../../Style/theme';
import {singleQuery} from '../../utils/util';
import * as Animatable from 'react-native-animatable';
import {useBoundStore} from '../../store/MainStore';

export default function CachePage() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const {count, setData, data: mmkvData, clearStorage} = useBoundStore();
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(['repoData', count]);

  const {data, error, isLoading} = useQuery({
    queryKey: ['repoData', count],
    queryFn: () => singleQuery(count),
    staleTime: 2000,
  });
  const displayData = cachedData || data;

  useEffect(() => {
    setData(cachedData);
  }, [count]);

  const fromRight = {
    from: {
      opacity: 0,
      transform: [
        {
          translateX: 500,
        },
      ],
    },
    to: {
      opacity: 1,
      transform: [
        {
          translateX: 0,
        },
      ],
    },
  };

  if (isLoading)
    return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Text style={[styles.text, {color: theme.textColor}]}>Loading...</Text>
      </View>
    );

  if (error)
    return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Text style={[styles.text, {color: theme.textColor}]}>
          An error has occurred
        </Text>
      </View>
    );

  return (
    <>
      <SafeAreaView
        style={{
          backgroundColor: theme.backgroundColor,
          flex: 1,
          flexDirection: 'row',
        }}>
        <FlatList
          data={mmkvData}
          ListHeaderComponentStyle={{
            alignSelf: 'center',
          }}
          ListHeaderComponent={
            <Text
              style={{
                // textAlign: 'center',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                textDecorationStyle: 'dotted',
                textDecorationLine: 'underline',
              }}>
              mmkv data
            </Text>
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  margin: 14,
                }}>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, fontWeight: 'bold'},
                  ]}>
                  {item?.name}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 8},
                  ]}>
                  {item?.phone}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.email}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.website}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.city}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.street}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.suite}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.zipcode}
                </Text>
              </View>
            );
          }}
        />

        <FlatList
          data={displayData}
          ListHeaderComponentStyle={{
            alignSelf: 'center',
          }}
          ListHeaderComponent={
            <Text
              style={{
                // textAlign: 'center',
                fontWeight: 'bold',
                textDecorationStyle: 'dotted',
                textDecorationLine: 'underline',
                textTransform: 'capitalize',
              }}>
              cached Data
            </Text>
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  margin: 14,
                }}>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, fontWeight: 'bold'},
                  ]}>
                  {item?.name}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 8},
                  ]}>
                  {item?.phone}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.email}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.website}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.city}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.street}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.suite}
                </Text>
                <Text
                  style={[
                    styles.text,
                    {color: theme.textColor, paddingVertical: 2},
                  ]}>
                  {item?.address.zipcode}
                </Text>
              </View>
            );
          }}
        />
      </SafeAreaView>
      <Animatable.View duration={300} animation={fromRight}>
        <TouchableOpacity
          style={{
            width: '30%',
            backgroundColor: 'red',
            // paddingHorizontal: 14,
            borderRadius: 14,
            alignSelf: 'center',
            padding: 4,
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}
          onPress={() => {
            clearStorage();
          }}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: 18,
            }}>
            Clear Storage
          </Text>
        </TouchableOpacity>
      </Animatable.View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
