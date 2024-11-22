import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchPosts} from '../../utils/util';
import {darkTheme, lightTheme} from '../../Style/theme';
import * as Animatable from 'react-native-animatable';

const Tanstack_Infinite_Scroll = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  const loadMore = () => {
    // console.log({hasNextPage});
    // console.log({isFetchingNextPage});

    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  // console.log({status});
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
  const fromLeft = {
    from: {
      opacity: 0,
      transform: [
        {
          translateX: -500,
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
          An error has occurred: {error.message}
        </Text>
      </View>
    );
  const posts = data?.pages?.flatMap(page => {
    // console.log(page.items);
    return page.items;
  });
  // console.log(posts?.pages)
  return (
    <FlatList
      style={{
        backgroundColor: theme.backgroundColor,
      }}
      data={posts}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item, index}) => {
        console.log(item);
        return (
          <ItemComponent
            item={item}
            index={index + 1}
            theme={theme}
            fromRight={fromRight}
            fromLeft={fromLeft}
          />
        );
      }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.7}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color={theme.activityIndicatorColor} size={32} />
        ) : null
      }
    />
  );
};

const ItemComponent = ({item, index, theme, fromRight, fromLeft}) => (
  <TouchableOpacity
    style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
    <View style={{flexDirection: 'row'}}>
      <Animatable.Text
        animation={fromLeft}
        style={[styles.index, {color: theme.textColor}]}>
        {index}
      </Animatable.Text>
      <View style={{flexDirection: 'column', width: '85%'}}>
        <View
          style={{
            backgroundColor: 'rgba(255,0,0,0.6)',
            borderRadius: 8,
            paddingVertical: 4,
          }}>
          <Animatable.Text
            animation={fromRight}
            style={[styles.title, {color: theme.textColor}]}>
            {item.title}
          </Animatable.Text>
        </View>
        <Animatable.Text
          animation={fromRight}
          style={[styles.body, {color: theme.textColor}]}>
          {item.body}
        </Animatable.Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default Tanstack_Infinite_Scroll;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
  },
  index: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingRight: 10,
    alignSelf: 'center',
    width: '15%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    letterSpacing: 1,
    // textDecorationLine: 'underline',
    paddingHorizontal: 8,
  },
  body: {fontSize: 16, letterSpacing: 1, paddingHorizontal: 8},
});
