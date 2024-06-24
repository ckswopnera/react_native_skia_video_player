// MyInfiniteScrollComponent.js
import React from 'react';
import {
  FlatList,
  ActivityIndicator,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useInfiniteQuery} from '@tanstack/react-query';
import {fetchPosts} from '../utils/util';

const Tanstack_Infinite_Scroll = () => {
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

  if (isLoading) {
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
        }}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 16,
            paddingTop: 20,
            // backgroundColor:'#000'
          }}>
          Loading...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
        }}>
        <Text
          style={{
            color: '#fff',
            textAlign: 'center',
            fontSize: 16,
            paddingTop: 20,
          }}>
          Error fetching data
        </Text>
      </View>
    );
  }
  const posts = data?.pages?.flatMap(page => {
    // console.log(page.items);

    return page.items;
  });

  return (
    <FlatList
      style={{
        backgroundColor: '#000',
      }}
      data={posts}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <ItemComponent item={item} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.7}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator color={'#fff'} size={32} />
        ) : null
      }
    />
  );
};

const ItemComponent = ({item}) => (
  <TouchableOpacity
    style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
    <Text
      style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textTransform: 'capitalize',
      }}>
      {item.title}
    </Text>
    <Text style={{fontSize: 16, color: '#fff'}}>{item.body}</Text>
  </TouchableOpacity>
);

export default Tanstack_Infinite_Scroll;
