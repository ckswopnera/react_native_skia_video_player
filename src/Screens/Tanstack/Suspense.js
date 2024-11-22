import React, {lazy, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  ActivityIndicator,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {
  QueryClient,
  QueryClientProvider,
  QueryErrorResetBoundary,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {ErrorBoundary} from 'react-error-boundary';
import {fetchProjectsSuspense} from '../../utils/util';
import {darkTheme, lightTheme} from '../../Style/theme';

const DetailsPage = ({activeProject, setActiveProject}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const {data, isFetching} = useSuspenseQuery({
    queryKey: ['suspense', activeProject],
    queryFn: () => fetchProjectsSuspense(activeProject),
  });
  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
        },
      ]}>
      <TouchableOpacity
        onPress={() => setActiveProject(null)}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 10,
          backgroundColor: '#333',
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 10,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: '#fff',
          }}>
          Back
        </Text>
      </TouchableOpacity>
      <Text
        style={[
          styles.title,
          {
            color: theme.textColor,
            fontSize: 52,
          },
        ]}>
        {activeProject}
        {isFetching ? <ActivityIndicator size="large" color="red" /> : null}
      </Text>

      {data ? (
        <View style={styles.details}>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent:'space-evenly',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 14,
                color: theme.textColor,
              }}>
              Title:
            </Text>
            <Text
              style={{
                // fontWeight: 'bold',
                fontSize: 14,
                width: '90%',
                textTransform: 'capitalize',
                color: theme.textColor,
              }}>
              {data[activeProject - 1].title}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              // justifyContent:'space-evenly',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 14,
                color: theme.textColor,
              }}>
              Body:
            </Text>
            <Text
              style={{
                // fontWeight: 'bold',
                fontSize: 14,
                width: '90%',
                textTransform: 'capitalize',
                color: theme.textColor,
              }}>
              {data[activeProject - 1].body}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const InitialPage = ({setActiveProject}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const queryClient = useQueryClient();
  const {data, isFetching} = useSuspenseQuery({
    queryKey: ['suspense'],
    queryFn: fetchProjectsSuspense,
  });

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {/* {console.log({data})} */}

      {isFetching && <ActivityIndicator size="large" color="red" />}
      {data.map((project, j) => (
        <TouchableOpacity
          key={j.toString()}
          style={styles.projectItem}
          onPress={() => {
            // Prefetch the project query
            queryClient.prefetchQuery({
              queryKey: ['suspense', project.id],
              queryFn: () => fetchProjectsSuspense(project.title),
            });
            setActiveProject(project.id);
          }}>
          <Text
            style={[
              styles.projectName,
              {
                color: theme.textColor,
              },
            ]}>
            {project.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default function Suspense() {
  const queryClient = useQueryClient();
  const [showProjects, setShowProjects] = React.useState(false);
  const [activeProject, setActiveProject] = React.useState(null);

  useEffect(() => {
    setShowProjects(old => {
      if (!old) {
        queryClient.prefetchQuery({
          queryKey: ['suspense'],
          queryFn: fetchProjectsSuspense,
        });
      }
      return !old;
    });
  }, []);
  return (
    <View
      style={[
        styles.container,
        {
          flex: 1,
        },
      ]}>
      <QueryErrorResetBoundary>
        {({reset}) => (
          <ErrorBoundary
            fallbackRender={({error, resetErrorBoundary}) => (
              <View>
                <Text>There was an error!</Text>
                <Button title="Try again" onPress={resetErrorBoundary} />
                <Text style={styles.error}>{error.message}</Text>
              </View>
            )}
            onReset={reset}>
            <React.Suspense
              fallback={<ActivityIndicator size="large" color="red" />}>
              {showProjects ? (
                activeProject ? (
                  <DetailsPage
                    activeProject={activeProject}
                    setActiveProject={setActiveProject}
                  />
                ) : (
                  <InitialPage setActiveProject={setActiveProject} />
                )
              ) : null}
            </React.Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
      {/* <Pressable
        style={{
          backgroundColor: '#333',
          padding: 14,
          marginHorizontal: 18,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 20,
          position: 'absolute',
          bottom: 10,
          right: 0,
          left: 0,
        }}
        onPress={() => {
          setShowProjects(old => {
            if (!old) {
              queryClient.prefetchQuery({
                queryKey: ['suspense'],
                queryFn: fetchProjectsSuspense,
              });
            }
            return !old;
          });
        }}>
        <Text
          style={{
            color: '#fff',
          }}>
          {showProjects ? 'Hide Projects' : 'Show Projects'}
        </Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'flex-end',
    padding: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  details: {
    marginTop: 16,
  },
  title2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#666',
    borderRadius: 12,
    padding: 10,
  },
  projectName: {
    margin: 2,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
