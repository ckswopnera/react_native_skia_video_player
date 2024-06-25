// MyComponent.js
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {fetchPosts, queryClient} from '../utils/util';

const Tanstack_queryclient = () => {
  const {data, error, isLoading} = useQuery({
    queryKey: ['postsNew'],
    queryFn: fetchPosts,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data.items}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => <ItemComponent item={item} />}
      />
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#333',
  },
  postContainer: {
    marginBottom: 10,
    // padding: 10,
    // borderWidth: 1,
    // borderColor: '#ccc',
    // borderRadius: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'left',
    color: '#fff',
  },
});

export default Tanstack_queryclient;
