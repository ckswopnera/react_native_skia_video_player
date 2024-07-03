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
import {fetchPosts} from '../utils/util';
import {darkTheme, lightTheme} from '../Style/theme';

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

  return (
    <FlatList
      style={{
        backgroundColor: theme.backgroundColor,
      }}
      data={posts}
      keyExtractor={item => item.id.toString()}
      renderItem={({item, index}) => (
        <ItemComponent item={item} index={index + 1} theme={theme} />
      )}
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

const ItemComponent = ({item, index, theme}) => (
  <TouchableOpacity
    style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
    <View style={{flexDirection: 'row'}}>
      <Text style={[styles.index, {color: theme.textColor}]}>{index}</Text>
      <View style={{flexDirection: 'column', width: '85%'}}>
        <Text style={[styles.title, {color: theme.textColor}]}>
          {item.title}
        </Text>
        <Text style={[styles.body, {color: theme.textColor}]}>{item.body}</Text>
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
    textDecorationLine: 'underline',
  },
  body: {fontSize: 16, letterSpacing: 1},
});
