import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {darkTheme, lightTheme} from '../../Style/theme';
import {fetchProjects} from '../../utils/util';
import * as Animatable from 'react-native-animatable';

export default function UseQueryInfinite() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const previousButtonVisible = useSharedValue(page !== 1 ? 1 : 0);

  const {status, data, error, isFetching, isPreviousData} = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
    keepPreviousData: true,
    staleTime: 5000,
  });

  // React.useEffect(() => {
  //   if (!isPreviousData) {
  //     queryClient.prefetchQuery({
  //       queryKey: ['projects', page + 1],
  //       queryFn: () => fetchProjects(page + 1),
  //     });
  //   }
  // }, [data, isPreviousData, page, queryClient]);
  queryClient.prefetchQuery({
    queryKey: ['projects', page + 1],
    queryFn: () => fetchProjects(page + 1),
    enabled: !isPreviousData ? true : false,
  });
  React.useEffect(() => {
    const button = () => {
      previousButtonVisible.value = withTiming(page !== 1 ? 1 : 0, {
        duration: 300,
      });
    };
    button();
  }, [page, previousButtonVisible]);

  const previousButtonStyle = useAnimatedStyle(() => {
    return {
      flex: previousButtonVisible.value,
      opacity: previousButtonVisible.value,
    };
  });

  const nextButtonStyle = useAnimatedStyle(() => {
    return {
      flex: previousButtonVisible.value === 1 ? 1 : 1.4,
    };
  });
  const fromLeft = {
    from: {
      opacity: 0,
      transform: [
        {
          translateX: -200,
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
  const fromRight = {
    from: {
      opacity: 0,
      transform: [
        {
          translateX: 200,
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
  return (
    <>
      <Text
        style={{
          color: '#fff',
          textAlign: 'center',
          position: 'absolute',
          top: 10,
          right: 10,
          borderWidth: 1,
          borderColor: '#666',
          padding: 8,
          backgroundColor: theme.buttonColor,
          borderRadius: 20,
        }}>
        {page}
      </Text>
      <ScrollView>
        {status === 'loading' ? (
          <Text>Loading...</Text>
        ) : status === 'error' ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <View>
            {data?.map((project, index) => (
              <Animatable.View
                animation={index % 2 === 0 ? fromLeft : fromRight}
                key={project.id}
                style={{
                  padding: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#666',
                  margin: 4,
                }}>
                <Text
                  style={{
                    color: theme.textColor,
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}>
                  {project?.title}
                </Text>
                <Text
                  style={{
                    color: theme.textColor,
                  }}>
                  {project?.body}
                </Text>
              </Animatable.View>
            ))}
          </View>
        )}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          position: 'absolute',
          bottom: 10,
          right: 0,
          left: 0,
        }}>
        <Animated.View style={[styles.button, previousButtonStyle]}>
          <TouchableOpacity
            onPress={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1}
            style={{
              backgroundColor: 'red',
              paddingVertical: 12,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Previous Page
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.button, nextButtonStyle]}>
          <TouchableOpacity
            onPress={() => setPage(old => old + 1)}
            disabled={isPreviousData || data?.length < 1}
            style={{
              backgroundColor: theme.buttonColor,
              paddingVertical: 12,
              borderRadius: 10,
            }}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {isFetching ? 'Loading...' : 'Next Page'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    justifyContent: 'center',
    elevation: 4,
    marginHorizontal: 18,
    // alignItems:'center',
  },
});
