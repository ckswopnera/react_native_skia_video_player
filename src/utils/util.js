import {
  Alert,
  Button,
  Dimensions,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  QueryClient,
  onlineManager,
  useQueryClient,
} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import {toast} from 'sonner-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const gToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3MjQ5MTA3ODMsImV4cCI6MTc1NjQ0Njc4MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.VZzn2OKVadlHaw_Q8xmZEa4qx6vonKguso34eqE4Ghc';
export const queryClient = new QueryClient();

export const prefetchData = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['prefetchQuery'],
    queryFn: fetchPosts,
    staleTime: 5000,
  });
};
export const tokenCheck = async loginData => {
  // console.log({loginData})
  try {
    const response = await fetch(`https://dummyjson.com/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        username: 'emilys',
        password: 'emilyspass',
        expiresInMins: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log({err});
    throw err;
  }
};

export const tokenExpiryCheck = async token => {
  // console.log('test',token)
  try {
    const response = await fetch('https://dummyjson.com/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log({err});
    throw err;
  }
};
export const fetchPosts = async ({pageParam = 1}) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
    );
    const data = await response.json();
    return {
      items: data,
      nextCursor: pageParam + 1,
      prevCursor: pageParam > 1 ? pageParam - 1 : undefined,
    };
  } catch (err) {
    throw err;
  }
};

export const singleQuery = async count => {
  // console.log({count})
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users?_limit=${count}`,
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log({err});
    throw err;
  }
};

export const fetchPosts_Crud = async signal => {
  // console.log({signal})
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts?_limit=10',
      // 'https://jsonplaceholder.typicode.com/posts/1',
      {
        signal,
      },
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data;
  } catch (err) {
    console.log('fetchPosts_Crud error', err);
    throw err;
  }
};

export const fetchTest_Crud = async (data, signal) => {
  console.log('fetchTest_Crud', signal, data);
  try {
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/posts/1',
      {
        signal,
      },
    );
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error in createPost_Crud:', err);
    throw err;
  }
};

export const createPost_Crud = async (postId, signal) => {
  console.log('createPost_Crud', signal, postId);
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      signal: signal,
      method: 'POST',
      body: JSON.stringify({
        title: 'foo',
        body: 'bar',
        userId: 1,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    // console.log({response})
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    const data = await response.json();

    return data;
  } catch (err) {
    console.log('Error in createPost_Crud:', err);
    throw err;
  }
};
export const updatePost_Crud = async (postId, signal) => {
  console.log('updatePost_Crud', {signal}, {postId});

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        signal: signal,
        method: 'PUT',
        body: JSON.stringify({
          id: postId,
          title: 'foo',
          body: 'bar',
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
    console.log({response});
    if (!response.ok) {
      throw new Error('Failed to update post');
    }
    const data = await response.json();
    // console.log({data});

    return data;
  } catch (error) {
    console.log('Error in updatePost_Crud:', error);
    throw error;
  }
};

export const deletePost_Crud = async (postId, signal) => {
  try {
    console.log('deletePost_Crud', postId, signal);

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
      {
        signal: signal,
        method: 'DELETE',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to delete post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error in deletePost_Crud:', error);
    throw error;
  }
};

export const infiniteFunction = async ({pageParam = 1}) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
    );
    const result = await response.json();
    return {
      data: result,
      nextId: pageParam + 1,
      previousId: pageParam > 1 ? pageParam - 1 : undefined,
    };
  } catch (err) {
    throw err;
  }
};

export const fetchProjects = async (page = 1) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`,
    );
    return await response.json();
  } catch (err) {
    throw err;
  }
};

export const fetchProjectsSuspense = async (page = 1) => {
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=14`,
    );
    return await response.json();
  } catch (err) {
    throw err;
  }
};

export const msToTime = duration => {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds;
};

export const darkenMatrix = [
  1,
  0,
  0,
  0,
  0, // Red channel stays the same0,
  1,
  0,
  0,
  0, // Green channel stays the same
  0,
  0,
  1,
  0,
  0, // Blue channel stays the same
  0,
  0,
  0,
  1,
  0, // Alpha channel stays the same
];

export const overlayMatrix = [
  1,
  0,
  0,
  0,
  0, // Red channel stays the same
  0,
  1,
  0,
  0,
  0, // Green channel stays the same
  0,
  0,
  1,
  0,
  0, // Blue channel stays the same
  0,
  0,
  0,
  0.7,
  0, // Alpha channel is reduced to 0.7 to apply transparency
];

export const DATA_For_One_Month = [
  {
    title: 'Month 1',
    data: [
      {day: 1, highTmp: 35},

      {day: 2, highTmp: 36},
      {day: 3, highTmp: 34},
      {day: 4, highTmp: 37},
      {day: 5, highTmp: 39},
      {day: 6, highTmp: 38},
      {day: 7, highTmp: 35},
      {day: 8, highTmp: 33},
      {day: 9, highTmp: 34.2},
      {day: 10, highTmp: 36},
      {day: 11, highTmp: 37},
      {day: 12, highTmp: 35},
      {day: 13, highTmp: 34},
      {day: 14, highTmp: 36},
      {day: 15, highTmp: 38},
      {day: 16, highTmp: 37},
      {day: 17, highTmp: 36},
      {day: 18, highTmp: 35},
      {day: 19, highTmp: 33},
      {day: 20, highTmp: 34},
      {day: 21, highTmp: 35},
      {day: 22, highTmp: 37},
      {day: 23, highTmp: 36},
      {day: 24, highTmp: 38},
      {day: 25, highTmp: 39},
      {day: 26, highTmp: 37},
      {day: 27, highTmp: 36},
      {day: 28, highTmp: 35},
      {day: 29, highTmp: 34},
      {day: 30, highTmp: 36},
      // {day: 31, highTmp: 38},
      // {day: 32, highTmp: 38},
      // {day: 33, highTmp: 38},
      // {day: 34, highTmp: 38},
      // {day: 35, highTmp: 38},
    ],
  },
  // {title:'Month 2',
  //   data:
  // [
  //   {day: 1, highTmp: 32},
  //   {day: 2, highTmp: 31},
  //   {day: 3, highTmp: 30},
  //   {day: 4, highTmp: 29},
  //   {day: 5, highTmp: 28},
  //   {day: 6, highTmp: 30},
  //   {day: 7, highTmp: 31},
  //   {day: 8, highTmp: 32},
  //   {day: 9, highTmp: 33},
  //   {day: 10, highTmp: 34},
  //   {day: 11, highTmp: 35},
  //   {day: 12, highTmp: 36},
  //   {day: 13, highTmp: 37},
  //   {day: 14, highTmp: 38},
  //   {day: 15, highTmp: 39},
  //   {day: 16, highTmp: 40},
  //   {day: 17, highTmp: 41},
  //   {day: 18, highTmp: 42},
  //   {day: 19, highTmp: 43},
  //   {day: 20, highTmp: 44},
  //   {day: 21, highTmp: 45},
  //   {day: 22, highTmp: 46},
  //   {day: 23, highTmp: 47},
  //   {day: 24, highTmp: 48},
  //   {day: 25, highTmp: 49},
  //   {day: 26, highTmp: 50},
  //   {day: 27, highTmp: 51},
  //   {day: 28, highTmp: 52},
  //   {day: 29, highTmp: 53},
  //   {day: 30, highTmp: 50},

  // ]},
  // {title:'Month 3',
  //   data:
  // [
  //   { day: 1, highTmp: 20 },
  //   { day: 2, highTmp: 21 },
  //   { day: 3, highTmp: 22 },
  //   { day: 4, highTmp: 23 },
  //   { day: 5, highTmp: 24 },
  //   { day: 6, highTmp: 25 },
  //   { day: 7, highTmp: 26 },
  //   { day: 8, highTmp: 27 },
  //   { day: 9, highTmp: 28 },
  //   { day: 10, highTmp: 29 },
  //   { day: 11, highTmp: 30 },
  //   { day: 12, highTmp: 31 },
  //   { day: 13, highTmp: 32 },
  //   { day: 14, highTmp: 33 },
  //   { day: 15, highTmp: 34 },
  //   { day: 16, highTmp: 35 },
  //   { day: 17, highTmp: 36 },
  //   { day: 18, highTmp: 37 },
  //   { day: 19, highTmp: 38 },
  //   { day: 20, highTmp: 39 },
  //   { day: 21, highTmp: 40 },
  //   { day: 22, highTmp: 41 },
  //   { day: 23, highTmp: 42 },
  //   { day: 24, highTmp: 43 },
  //   { day: 25, highTmp: 44 },
  //   { day: 26, highTmp: 45 },
  //   { day: 27, highTmp: 46 },
  //   { day: 28, highTmp: 47 },
  //   { day: 29, highTmp: 48 },
  //   { day: 30, highTmp: 49 },
  //   { day: 31, highTmp: 50 }
  // ]}
];

export const candleStickData = [
  {
    timestamp: 1625945400000,
    open: 33575.25,
    high: 33600.52,
    low: 33475.12,
    close: 33520.11,
  },
  {
    timestamp: 1625946300000,
    open: 33545.25,
    high: 33560.52,
    low: 33510.12,
    close: 33520.11,
  },
  {
    timestamp: 1625947200000,
    open: 33510.25,
    high: 33515.52,
    low: 33250.12,
    close: 33250.11,
  },
  {
    timestamp: 1625948100000,
    open: 33215.25,
    high: 33430.52,
    low: 33215.12,
    close: 33420.11,
  },
];

export const toast_success = () => {
  toast.success('Operation successful!', {
    // className: 'bg-green-500',
    // style: { backgroundColor: 'blue' },
    description: 'Everything worked as expected.',
    // duration: 6000,
    // icon: <SomeIcon />,
  });
};
export const toast_error = (e,f) => {
  // console.log({e}, {f});
  toast.error(e, {
    // className: 'bg-green-500',
    // style: { backgroundColor: 'blue' },
    description: f,
    // duration: 6000,
    // icon: <SomeIcon />,
    duration: Infinity,
  });
};
export const toast_warning = () => {
  toast.warning('Operation warning!', {
    // className: 'bg-green-500',
    style: {alignItems: 'center', justifyContent: 'center'},
    description: 'Everything worked as expected.',
    // duration: 6000,
    // icon: <SomeIcon />,
  });
};

export const toast_action = () => {
  toast.success('Operation warning!', {
    // className: 'bg-green-500',
    style: {alignItems: 'center', justifyContent: 'center'},
    description: 'Everything worked as expected.',
    // duration: 6000,
    // icon: <SomeIcon />,

    action: {
      label: 'Ok',
      onClick: () => console.log('Ok!'),
    },
    cancel: {
      label: 'Cancel',
      onClick: () => console.log('Cancel!'),
    },
    duration: Infinity,
    // closeButton: true,

  });
};
export const toast_custom = (e, f) => {
  if (e !== undefined || f !== undefined) {
    toast.custom(
      <View
        style={{
          elevation: 4,
          backgroundColor: '#fff',
          paddingVertical: 20,
          paddingRight: 20,
          paddingLeft: 10,
          width: '90%',
          borderRadius: 12,
          marginVertical: 4,
          // pa
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <FontAwesome6
            name="triangle-exclamation"
            size={30}
            color={'rgba(255,51,51,1)'}
          />
          <View
            style={{
              width: '85%',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 16,
                color: '#000',
              }}>
              {e}
            </Text>
            <Text
              style={{
                fontWeight: 'semibold',
              }}>
              {f}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  console.log('Decline');
                  toast.dismiss();
                }}
                style={
                  {
                    // width: '80%',
                  }
                }>
                <Text>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('Ask me later');
                  toast.dismiss();
                }}
                style={
                  {
                    // width: '80%',
                  }
                }>
                <Text>Ask me later</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('Accepted');
                  // toast.dismiss();
                }}
                style={{
                  // width: '80%',
                  borderWidth: 1,
                  borderColor: '#000',
                  borderRadius: 8,
                  padding: 10,
                }}>
                <Text
                  style={{
                    color: '#000',
                  }}>
                  Accept
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>,
      {duration: Infinity},
    );
  }
};

export const toast_loading = () => {
  toast.loading('Loading...', {
    description: 'Everything worked as expected.',
  });
};
