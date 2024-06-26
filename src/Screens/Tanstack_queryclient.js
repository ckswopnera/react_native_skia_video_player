// MyComponent.js
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {fetchPosts} from '../utils/util';

const Tanstack_Queryclient = () => {
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
        renderItem={({item, index}) => (
          <ItemComponent item={item} index={index + 1} />
        )}
      />
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#000',
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

export default Tanstack_Queryclient;
