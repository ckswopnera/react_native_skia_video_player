import React from 'react';
import { View, Text, SafeAreaView, useColorScheme, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { darkTheme, lightTheme } from '../Style/theme';

export default function Tanstack_Single_Query() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then(res =>
        res.json(),
      ),
  });

  if (isLoading)
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={[styles.text, { color: theme.textColor }]}>
          Loading...
        </Text>
      </View>
    );

  if (error)
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={[styles.text, { color: theme.textColor }]}>
          An error has occurred: {error.message}
        </Text>
      </View>
    );

  return (
    <SafeAreaView style={{ backgroundColor: theme.backgroundColor,flex:1 }}>
      <Text style={[styles.text, { color: theme.textColor }]}>
        {data?.name}
      </Text>
      <Text style={[styles.text, { color: theme.textColor }]}>
        {data?.description}
      </Text>
      <Text style={[styles.text, { color: theme.textColor }]}>
        👀 {data?.subscribers_count}
      </Text>
      <Text style={[styles.text, { color: theme.textColor }]}>
        ✨ {data?.stargazers_count}
      </Text>
      <Text style={[styles.text, { color: theme.textColor }]}>
        🍴 {data?.forks_count}
      </Text>
    </SafeAreaView>
  );
}

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
});
