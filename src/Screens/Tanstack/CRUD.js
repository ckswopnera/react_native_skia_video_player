import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useQuery, useMutation, useIsMutating} from '@tanstack/react-query';
import {
  deletePost_Crud,
  fetchPosts_Crud,
  queryClient,
  updatePost_Crud,
  createPost_Crud,
  fetchTest_Crud,
} from '../../utils/util';
import {darkTheme, lightTheme} from '../../Style/theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

export default function PostsComponent() {
  const [signal, setSignal] = useState(false);
  const [bulb, setBulb] = useState(false);

  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  const {
    data: posts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['postCrud'],
    queryFn: () => fetchPosts_Crud(signal),
    // refetchOnWindowFocus: 'always',
    // staleTime:2000,
  });
  const isMutating = useIsMutating();

  const combineMutation = useMutation({
    mutationKey: 'postCrud',
    mutationFn: async ({newPost, updatedPost, testPost}) => {
      try {
        const result = await Promise.all([
          createPost_Crud(newPost.data, newPost.s),
          updatePost_Crud(updatedPost.data, updatedPost.s),
          fetchTest_Crud(testPost.data, testPost.s),
        ]);
        console.log({result});
        return result;
      } catch (err) {
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['postCrud']});
      Alert.alert('All operations completed successfully');
    },
    onError: error => {
      if (error.name === 'AbortError') {
        Alert.alert('Request Aborted', 'The operation was aborted.');
      } else {
        console.error('An error occurred:', error);
      }
    },
  });

  const mutationCreate = useMutation({
    mutationKey: 'postCrud',
    mutationFn: async ({postId, s}) => {
      try {
        const result = await createPost_Crud(postId, s);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['postCrud']});
      Alert.alert('Success', 'Post created successfully!');
    },
    onError: error => {
      if (error.name === 'AbortError') {
        Alert.alert('Request Aborted', 'The creation operation was aborted.');
      } else {
        Alert.alert('Error', 'Failed to create post.');
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationKey: 'postCrud',
    mutationFn: async ({postId, s}) => {
      try {
        const result = await updatePost_Crud(postId, s);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['postCrud']});
      Alert.alert('Success', 'Post updated successfully!');
    },
    onError: error => {
      if (error.name === 'AbortError') {
        Alert.alert('Request Aborted', 'The update operation was aborted.');
      } else {
        Alert.alert('Error', 'Failed to update post.');
      }
    },
  });
  const mutationDelete = useMutation({
    mutationKey: 'postCrud',
    mutationFn: async ({postId, s}) => {
      try {
        const result = await deletePost_Crud(postId, s);
        console.log({result});
        return result;
      } catch (error) {
        console.log({error});
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['postCrud']});
      Alert.alert('Success', 'Post deleted successfully!');
    },
    onError: error => {
      if (error.name === 'AbortError') {
        Alert.alert('Request Aborted', 'The deletion operation was aborted.');
      } else {
        Alert.alert('Error', 'Failed to delete post.');
      }
    },
  });

  const handleCreate = postId => {
    const controller = new AbortController();
    const sk = controller.signal;

    mutationCreate.mutate({postId, s: sk});
    // setTimeout(() => controller.abort(), 100);
    if (signal !== false) {
      controller.abort();
    }
  };
  const handleUpdate = postId => {
    const controller = new AbortController();
    const sk = controller.signal;

    Alert.alert(
      'Confirm Update',
      `Are you sure you want to update this post with ID: ${postId}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: () => {
            mutationUpdate.mutate({postId, s: sk});
            // setTimeout(() => controller.abort(), 100);
            if (signal !== false) {
              controller.abort();
            }
          },
          style: 'destructive',
        },
      ],
    );
  };
  const handleDelete = postId => {
    const controller = new AbortController();
    const sk = controller.signal;

    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            mutationDelete.mutate({postId, s: sk});

            // setTimeout(() => controller.abort(), 100);
            if (signal !== false) {
              controller.abort();
            }
          },
          style: 'destructive',
        },
      ],
    );
  };
  const Icons = [
    {
      name: 'cloud-upload',
      onPress: handleCreate,
    },
    {
      name: 'create',
      onPress: handleUpdate,
    },
    {
      name: 'delete',
      onPress: handleDelete,
    },
  ];

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Loading posts...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Error loading posts.</Text>
      </View>
    );
  }

  if (isMutating) {
    return <ActivityIndicator size={'large'} color={'lightgreen'} />;
  }

  const zoomIn = {
    0: {
      opacity: 0,
      scale: 0,
    },
    0.5: {
      opacity: 1,
      scale: 0.3,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };

  const fromLeft = {
    from: {
      opacity: 0,
      transform: [
        {
          translateX: -500,
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

  const ItemComponent = ({item, theme, index}) => {
    // console.log({item},{index})
    return (
      <View
        style={{padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <View style={{flexDirection: 'row'}}>
          <Animatable.View
            animation={fromLeft}
            style={{flexDirection: 'column'}}>
            <Text style={[styles.title, {color: theme.textColor}]}>
              {item.title}
            </Text>
            <Text style={[styles.body, {color: theme.textColor}]}>
              {item.body}
            </Text>
            <Text style={[styles.title, {color: theme.textColor}]}>
              {item.heading}
            </Text>
            <Text style={[styles.body, {color: theme.textColor}]}>
              {item.description}
            </Text>
          </Animatable.View>
        </View>
        <Animatable.View
          animation={zoomIn}
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <TouchableOpacity
            style={{paddingHorizontal: 4}}
            onPress={() => {
              signal === false
                ? setSignal(new AbortController().signal)
                : setSignal(false);
            }}>
            <MaterialIcons
              name="change-circle"
              size={30}
              color={signal === false ? '#666' : 'red'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingHorizontal: 4}}
            onPress={() => {
              const controller = new AbortController();
              const sk = controller.signal;
              combineMutation.mutate({
                newPost: {data: 1, s: sk},
                updatedPost: {data: 1, s: sk},
                testPost: {data: 1, s: sk},
              });
              if (signal !== false) {
                controller.abort();
              }
            }}>
            <MaterialIcons
              name="code"
              size={30}
              color={signal === false ? '#666' : 'red'}
            />
          </TouchableOpacity>
          {Icons.map((i, j) => (
            <TouchableOpacity
              key={j.toString()}
              style={{paddingHorizontal: 4}}
              onPress={() => i.onPress(item.id)}>
              <MaterialIcons
                name={i.name}
                size={30}
                color={signal === false ? '#666' : 'red'}
              />
            </TouchableOpacity>
          ))}
        </Animatable.View>
      </View>
    );
  };

  return (
    <View style={{padding: 20}}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <ItemComponent item={item} theme={theme} index={index} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  body: {
    fontSize: 16,
    letterSpacing: 1,
  },
});
