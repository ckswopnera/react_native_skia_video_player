import React, {useEffect, useState} from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {darkTheme, lightTheme} from '../../Style/theme';

export default function Tanstack_Infinite_Button() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [pageNumber, setPageNumber] = useState([1, 2, 3]);
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: async ({pageParam = 1}) => {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
      );
      const result = await response.json();
      return {
        data: result,
        nextId: pageParam + 1,
        previousId: pageParam > 1 ? pageParam - 1 : undefined,
      };
    },
    getPreviousPageParam: firstPage => firstPage.previousId ?? undefined,
    getNextPageParam: lastPage => lastPage.nextId ?? undefined,
    // maxPages: 1,
  });

  useEffect(() => {
    if (currentPageIndex >= 3) {
      setPageNumber([
        currentPageIndex - 1,
        currentPageIndex,
        currentPageIndex + 1,
      ]);
    } else {
      setPageNumber([1, 2, 3]);
    }
  }, [currentPageIndex]);
  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPageIndex(prev => prev + 1);
      fetchNextPage();
    }
  };

  const handlePreviousPage = () => {
    if (
      // hasPreviousPage &&
      currentPageIndex > 0
    ) {
      setCurrentPageIndex(prev => prev - 1);
      fetchPreviousPage();
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {status === 'loading' ? (
          <Text>Loading...</Text>
        ) : status === 'error' ? (
          <Text>Error: {error.message}</Text>
        ) : (
          <>
            {data?.pages?.[currentPageIndex]?.data?.map(project => (
              <View key={project.id} style={styles.projectContainer}>
                <Text
                  style={{
                    color: theme.textColor,
                  }}>
                  {project.title}
                </Text>
                <Text
                  style={{
                    color: theme.textColor,
                  }}>
                  {project.body}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View
        style={[
          styles.buttonsContainer,
          {
            backgroundColor: theme.buttonTextColor,
          },
        ]}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          disabled={
            // !hasPreviousPage ||
            currentPageIndex === 0 || isFetchingPreviousPage
          }
          style={[
            styles.button,
            {
              backgroundColor:
                currentPageIndex !== 0 ? 'red' : theme.buttonColor,
            },
          ]}>
          <Text
            style={{
              color: '#fff',
            }}>
            {isFetchingPreviousPage
              ? 'Loading more...'
              : //   hasPreviousPage &&
              currentPageIndex > 0
              ? 'Previous'
              : 'No previous data'}
          </Text>
        </TouchableOpacity>
        {pageNumber.map((i, j) => (
          <View
            key={j.toString()}
            style={{
              padding: 10,
              borderBottomWidth: currentPageIndex + 1 === i ? 1 : 0,
              borderColor: 'red',
            }}>
            <Text style={{color: currentPageIndex + 1 === i ?'red':theme.textColor}}>{i}</Text>
          </View>
        ))}
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 4,
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              left: -10,
              color: theme.textColor,
            }}>
            ...
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleNextPage}
          disabled={!hasNextPage || isFetchingNextPage}
          style={[
            styles.button,
            {
              backgroundColor: theme.buttonColor,
            },
          ]}>
          <Text
            style={{
              color: '#fff',
            }}>
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
              ? 'Next'
              : 'No more data'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80,
    // backgroundColor:'#333'
  },
  projectContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
    // backgroundColor: '#000',
  },
  pageNumber: {
    // marginBottom: 16,
    textAlign: 'center',
    color: '#333',
    position: 'absolute',
    bottom: 65,
    right: -5,
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 5,
    height: 30,
    width: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  button: {
    // padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#666',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: '30%',
    height: 50,
    // marginHorizontal: 5,
  },
});
