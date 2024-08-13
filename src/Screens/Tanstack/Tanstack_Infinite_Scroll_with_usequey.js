import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {darkTheme, lightTheme} from '../../Style/theme';

const fetchProjects = async (page = 1) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=2`,
  );
  return await response.json();
};

export default function UseQueryInfinite() {
  const queryClient = useQueryClient();
  const [page, setPage] = React.useState(1);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const {status, data, error, isFetching, isPreviousData} = useQuery({
    queryKey: ['projects', page],
    queryFn: () => fetchProjects(page),
    keepPreviousData: true,
    staleTime: 5000,
  });

  // Prefetch the next page
  React.useEffect(() => {
    if (!isPreviousData) {
      queryClient.prefetchQuery({
        queryKey: ['projects', page + 1],
        queryFn: () => fetchProjects(page + 1),
      });
    }
  }, [data, isPreviousData, page, queryClient]);

  return (
    <>
      <ScrollView>
        {status === 'loading' ? (
          <Text>Loading...</Text>
        ) : status === 'error' ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <View>
            {data?.map(project => (
              <View
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
                  }}>
                  {project?.title}
                </Text>
                <Text
                  style={{
                    color: theme.textColor,
                  }}>
                  {project?.body}
                </Text>
              </View>
            ))}
          </View>
        )}
        <Text
          style={{
            color: theme.textColor,
            textAlign: 'center',
          }}>
          Current Page: {page}
        </Text>

        {isFetching ? (
          <Text
            style={{
              color: theme.textColor,
              textAlign: 'center',
            }}>
            Loading...
          </Text>
        ) : null}
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        }}>
        <TouchableOpacity
          onPress={() => setPage(old => Math.max(old - 1, 1))}
          disabled={page === 1}
          style={{
            //   padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#666',
            marginVertical: 4,
            width: '30%',
            height: 50,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.textColor,
              textAlign: 'center',
            }}>
            {page === 1 ? 'No more data' : 'Previous Page'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            //   padding: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#666',
            marginVertical: 4,
            width: '30%',
            height: 50,
            justifyContent: 'center',
          }}
          onPress={() => setPage(old => old + 1)}
          disabled={isPreviousData || data?.length < 1}>
          <Text
            style={{
              color: theme.textColor,
              textAlign: 'center',
            }}>
            Next Page
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
