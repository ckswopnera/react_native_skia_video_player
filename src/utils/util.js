import {Alert, Dimensions, Platform} from 'react-native';
import {QueryClient, onlineManager} from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';

export const queryClient = new QueryClient();
export const prefetchData = async () => {
  await queryClient.prefetchQuery({ queryKey: ['postsNew'], queryFn: fetchPosts });
};
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;

export const fetchPosts = async ({ pageParam = 1 }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageParam}&_limit=10`);
    const data = await response.json();
  
    return {
      items: data,
      nextCursor: pageParam + 1,
    };
  };
  
  export const msToTime=(duration)=> {
    var milliseconds = parseInt((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return hours + ':' + minutes + ':' + seconds;
  }
