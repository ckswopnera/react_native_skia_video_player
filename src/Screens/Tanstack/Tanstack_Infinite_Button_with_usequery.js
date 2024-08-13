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
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {darkTheme, lightTheme} from '../../Style/theme';

const fetchProjects = async (page = 1) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=4`,
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
        {page !== 1 && (
          <TouchableOpacity
            onPress={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1}
            style={[
              styles.button,
              {
                backgroundColor: 'red',
              },
            ]}>
            <Text
              style={{
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Previous Page
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: theme.buttonColor,
            },
          ]}
          onPress={() => setPage(old => old + 1)}
          disabled={isPreviousData || data?.length < 1}>
          <Text
            style={{
              color: '#fff',
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            {isFetching ? 'Loading...' : 'Next Page'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    //   padding: 12,
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#666',
    marginVertical: 4,
    // width: '30%',
    height: 50,
    justifyContent: 'center',
    elevation: 4,
    flex: 1,
    marginHorizontal: 18,
  },
});
