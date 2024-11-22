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
  ActivityIndicator,
} from 'react-native';
import {darkTheme, lightTheme} from '../../Style/theme';
import {infiniteFunction} from '../../utils/util';
import * as Animatable from 'react-native-animatable';

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
    queryFn: infiniteFunction,
    getNextPageParam: lastPage => lastPage?.nextId ?? undefined,
    getPreviousPageParam: firstPage => firstPage?.previousId ?? undefined,
    // maxPages: 1,
  });

  useEffect(() => {
    if (currentPageIndex === 2) {
      setPageNumber([2, 3, 4]);
    } else if (currentPageIndex === 3) {
      setPageNumber([3, 4, 5]);
    } else if (currentPageIndex > 3) {
      setPageNumber([
        currentPageIndex,
        currentPageIndex + 1,
        currentPageIndex + 2,
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
    <View style={styles.container}>
      {status === 'pending' ||
      status === 'loading' ||
      isFetchingNextPage ||
      isFetchingPreviousPage ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.textColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Loading...
          </Text>
        </View>
      ) : status === 'error' ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: theme.textColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Error: {error.message}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <>
            {data?.pages?.[currentPageIndex]?.data?.map((project, index) => (
              <Animatable.View
                animation={index % 2 === 0 ? fromLeft : fromRight}
                key={project.id}>
                <TouchableOpacity style={styles.projectContainer}>
                  <Text
                    style={{
                      color: theme.textColor,
                      fontWeight: 'bold',
                      textTransform: 'capitalize',
                    }}>
                    {project.title}
                  </Text>
                  <Text
                    style={{
                      color: theme.textColor,
                    }}>
                    {project.body}
                  </Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </>
        </ScrollView>
      )}

      <View
        style={[
          styles.buttonsContainer,
          {
            backgroundColor: theme.buttonTextColor,
          },
        ]}>
        {currentPageIndex > 0 && (
          <Animatable.View
            duration={150}
            animation={fromLeft}
            style={{
              width: '30%',
            }}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: 'red',
                  elevation: 4,
                },
              ]}
              onPress={handlePreviousPage}
              disabled={
                // !hasPreviousPage ||
                currentPageIndex === 0 || isFetchingPreviousPage
              }>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {
                  //   hasPreviousPage &&
                  currentPageIndex > 0 ? 'Previous' : 'No more data'
                }
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        )}

        {pageNumber?.map((i, j) => {
          const isMiddleValueFocused =
            currentPageIndex >= 3 && j === Math.floor(pageNumber.length / 2);
          const isFirstOrSecondPageFocused =
            currentPageIndex < 3 && currentPageIndex + 1 === i;
          return (
            <View
              key={j.toString()}
              style={{
                padding: 10,
                borderBottomWidth:
                  isMiddleValueFocused || isFirstOrSecondPageFocused ? 1 : 0,
                borderColor:
                  isMiddleValueFocused || isFirstOrSecondPageFocused
                    ? 'red'
                    : 'transparent',
              }}>
              <Text
                style={{
                  color:
                    isMiddleValueFocused || isFirstOrSecondPageFocused
                      ? 'red'
                      : theme.textColor,
                }}>
                {i}
              </Text>
            </View>
          );
        })}

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
              elevation: 4,
              width: '30%',
            },
          ]}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
            }}>
            {hasNextPage ? 'Next' : 'No more data'}
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
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor:'#fff'
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
    // borderWidth: 1,
    // borderColor: '#666',
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // width: '30%',
    height: 50,
    // elevation: 4,
    // marginHorizontal: 5,
  },
});
