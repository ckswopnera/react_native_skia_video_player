import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {useQuery} from '@tanstack/react-query';

export default function Tanstack_Single_Query() {
  const {isLoading, error, data} = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then(res =>
        res.json(),
      ),
  });

  if (isLoading)
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,justifyContent: 'center', alignItems: 'center'
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#fff',
          }}>
          Loading...
        </Text>
      </View>
    );

  if (error)
    return (
      <View
        style={{
          backgroundColor: '#000',
          flex: 1,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: '#fff',
          }}>
          An error has occurred: {error.message}
        </Text>
      </View>
    );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}>
      <Text
        style={{
          color: '#fff',
        }}>
        {data?.name}
      </Text>
      <Text
        style={{
          color: '#fff',
        }}>
        {data?.description}
      </Text>
      <Text
        style={{
          color: '#fff',
        }}>
        👀 {data?.subscribers_count}
      </Text>
      <Text
        style={{
          color: '#fff',
        }}>
        ✨ {data?.stargazers_count}
      </Text>
      <Text
        style={{
          color: '#fff',
        }}>
        🍴 {data?.forks_count}
      </Text>
    </SafeAreaView>
  );
}
