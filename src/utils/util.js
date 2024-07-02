import {Alert, Dimensions, Platform} from 'react-native';
import {QueryClient, onlineManager} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

export const queryClient = new QueryClient();
export const prefetchData = async () => {
  await queryClient.prefetchQuery({
    queryKey: ['postsNew'],
    queryFn: fetchPosts,
  });
};
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const fetchPosts = async ({pageParam = 1}) => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`,
  );
  const data = await response.json();

  return {
    items: data,
    nextCursor: pageParam + 1,
  };
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
  1,0,0,0,0, // Red channel stays the same0,
  1,0,0,0, // Green channel stays the same
  0,0,1,0,0, // Blue channel stays the same
  0,0,0,1,0, // Alpha channel stays the same
];

export const overlayMatrix = [
  1,0,0,0,0, // Red channel stays the same
  0,1,0,0,0, // Green channel stays the same
  0,0,1,0,0, // Blue channel stays the same
  0,0,0,0.7,0, // Alpha channel is reduced to 0.7 to apply transparency
];

export const DATA_For_One_Month = [
  {title:'Month 1',
  data:
  [
    {day: 1, highTmp: 35},
    {day: 2, highTmp: 36},
    {day: 3, highTmp: 34},
    {day: 4, highTmp: 37},
    {day: 5, highTmp: 39},
    {day: 6, highTmp: 38},
    {day: 7, highTmp: 35},
    {day: 8, highTmp: 33},
    {day: 9, highTmp: 34},
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
    {day: 31, highTmp: 38},
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

