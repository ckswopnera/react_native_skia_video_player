// MyComponent.js
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {fetchPosts} from '../../utils/util';
import {darkTheme, lightTheme} from '../../Style/theme';
import * as Animatable from 'react-native-animatable';

const Tanstack_Queryclient = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const {data, error, isLoading} = useQuery({
    queryKey: ['prefetchQuery'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => {
      console.log(
        {lastPage},
        {
          pages,
        },
      );
      return lastPage;
    },

    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <ActivityIndicator size="large" color={theme.activityIndicatorColor} />
      </View>
    );
  }

  if (error)
    return (
      <View
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <Text style={[styles.text, {color: theme.textColor}]}>
          An error has occurred: {error.message}
        </Text>
      </View>
    );

  const postsNew = data?.items?.flatMap(page => {
    // console.log(page);
    return page;
  });

  const zoomIn = {
    0: {
      transform: [
        {
          scale: 1,
        },
        {
          translateX: 400,
          
        },
      ],
      // color:'#fff',

    },
    1: {
      transform: [
        {
          scale: 1,
        },
        {
          translateX: 0,
        },
      ],
      // color:'#000',

    },
  };

  const rotateIn = {
    0: {
      transform: [
        {
          scale: 1,
        },
        {
          rotateZ: '0deg',
        },
      ],
      color:'#fff',
    },
    1: {
      transform: [
        {
          scale: 1,
        },
        {
          rotateZ: '360deg',
        },
      ],
      color:'red',

    },
  };
  const ItemComponent = ({item, index, theme}) => 
    <TouchableOpacity
      style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
      <View style={{flexDirection: 'row'}}>
        <Animatable.Text
          animation={rotateIn}
          style={[styles.index, {color: theme.textColor}]}>
          {index}
        </Animatable.Text>
        <View style={{flexDirection: 'column', width: '85%'}}>
          <Animatable.Text
            animation={zoomIn}
            style={[styles.title, {color: theme.textColor}]}>
            {item.title}
          </Animatable.Text>
          <Animatable.Text
            animation={zoomIn}
            style={[styles.body, {color: theme.textColor}]}>
            {item.body}
          </Animatable.Text>
        </View>
      </View>
    </TouchableOpacity>
  ;

  return (
    <FlatList
      style={{
        backgroundColor: theme.backgroundColor,
      }}
      data={postsNew}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => (
        <>
          <ItemComponent item={item} index={index + 1} theme={theme} />
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 8,
  },
  postContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  index: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 10,
    alignSelf: 'center',
    width: '15%',
  },
  body: {fontSize: 16, letterSpacing: 1},
});

export default Tanstack_Queryclient;
