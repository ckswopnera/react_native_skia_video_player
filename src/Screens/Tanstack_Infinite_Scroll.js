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
          justifyContent: 'center',
          alignItems: 'center',
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
      renderItem={({item, index}) => (
        <ItemComponent item={item} index={index + 1} />
      )}
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

const ItemComponent = ({item, index}) => (
  <TouchableOpacity
    style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
    <View style={{flexDirection: 'row'}}>
      <Text
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          color: '#fff',
          textAlign: 'center',
          paddingRight: 10,
          alignSelf: 'center',
          width: '15%',
        }}>
        {index}
      </Text>
      <View style={{flexDirection: 'column', width: '85%'}}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'capitalize',
            letterSpacing: 1,
            textDecorationLine: 'underline',
          }}>
          {item.title}
        </Text>
        <Text style={{fontSize: 16, color: '#fff', letterSpacing: 1}}>
          {item.body}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default Tanstack_Infinite_Scroll;
