import {set} from 'react-hook-form';
import {gToken, toast_error, tokenExpiryCheck} from '../utils/util';
import {zustandMMKVStorage} from './storage/mmkv';
import {produce, freeze} from 'immer';

const initialState = {
  count: 1,
  data: [],
  showBar: true,
  isLoading: false,
  lush: {forest: {contains: {a: 0}}},
};
const initialStateToken = {
  token: null,
  isTokenExpired: false,
};

const initAnimalState = {
  bears: 0,
  fishes: 0,
};

const shallowObjectState = {
  objectLeft: {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    address: {
      street: 'Kulaskk Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496',
        x: 'm',
      },
    },
  },
  objectRight: {
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    address: {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenboroughmm',
      zipcode: '92998-3874',
      geo: {
        lat: '-37.3159',
        lng: '81.1496',
        y: 'kk',
      },
    },
  },
};

export const shallowObject = (set, get) => ({
  ...shallowObjectState,
});
export const resetStore = (set, get) => ({
  ...initialState,
  ...initialStateToken,
  ...initAnimalState,
  resetAllStores: () => {
    set(() => ({
      ...initialState,
      ...initialStateToken,
      ...initAnimalState,
    }));
  },
  killBothAnimal: () => set(initAnimalState),
  clearForest: e => {
    set(
      produce(state => {
        state.lush.forest.contains.a += e;
      }),
    );
  },
  clearForestImmer: e =>
    set(
      produce(state => {
        state.lush.forest.contains.a <= 0
          ? 0
          : (state.lush.forest.contains.a -= e);
      }),
    ),
});

export const createMainSlice = (set, get) => ({
  ...initialState,
  setIsLoading: isLoading => set({isLoading}),
  increment: () => set(state => ({count: state.count + 1})),
  decrement: () =>
    set(state => ({count: state.count <= 0 ? 0 : state.count - 1})),
  setData: newData =>
    set(state => {
      const filteredData = newData?.filter(
        newItem => !state?.data?.some(item => item?.id === newItem?.id),
      );
      const updatedData = state?.data?.filter(item =>
        newData.some(newItem => newItem?.id === item?.id),
      );
      return {data: [...updatedData, ...filteredData]};
    }),
  setShowBar: showBar => set({showBar}),
});

export const createTokenSlice = (set, get) => ({
  ...initialStateToken,

  setToken: token => {
    console.log('Setting token:', token);
    set({token});
    get().checkTokenValidity();
  },
  checkTokenValidity: async () => {
    const token = get().token;
    if (!token) {
      set({isTokenExpired: true});
      return;
    }
    try {
      const data = await tokenExpiryCheck(token);
      // console.log({data});
      const isExpired = data?.name === 'JsonWebTokenError' ? true : false;
      console.log('isExpired:', isExpired);
      set({isTokenExpired: isExpired});

    } catch (error) {
      console.log('Token parsing error:', error);
      set({isTokenExpired: true});
      toast_error('Error!', 'Token parsing error.');

    }
  },
  startTokenTimer: () => {
    const timeoutId = setTimeout(() => {
      get().checkTokenValidityTimer();
    }, 65000);
    set({timeoutId});
  },
  clearTokenTimer: () => {
    const timeoutId = get().timeoutId;
    if (timeoutId) {
      clearTimeout(timeoutId);
      set({timeoutId: null});
    }
  },
  checkTokenValidityTimer: async () => {
    const token = get().token;
    if (!token) {
      set({isTokenExpired: true});
      return;
    }
    try {
      const data = await tokenExpiryCheck(token);
      console.log({data});
      const isExpired =
        data?.name === 'JsonWebTokenError' || 'TokenExpiredError'
          ? true
          : false;
      console.log('isExpired:', isExpired);
      set({isTokenExpired: isExpired});
    } catch (error) {
      console.log('Token parsing error:', error);
      set({isTokenExpired: true});
      toast_error('Error!', 'Token parsing error.');

    }
  },

  clearToken: () => {
    console.log('Clearing token');
    set(initialStateToken);
  },
});

export const createStorageSlice = (set, get) => ({
  clearStorage: () => {
    zustandMMKVStorage.removeItem('skia-player-storage');
    set({data: []});
    console.log('deleted storage');
    // useBoundStore.persist.clearStorage();
  },
  getStorage: () => {
    const value = zustandMMKVStorage.getItem('skia-player-storage');
    console.log('ggggg', value);

    try {
      const parsedData = JSON.parse(value);
      // console.log({parsedData});

      return parsedData;
    } catch (error) {
      console.error('Error parsing data:', error.message);
      return error;
    }
  },
});
export const createFishSlice = (set, get) => ({
  ...initAnimalState,
  addFish: () => set(state => ({fishes: state.fishes + 1})),
  eatFish: () =>
    set(state => ({fishes: state.fishes <= 0 ? 0 : state.fishes - 1})),
});

export const createBearSlice = (set, get) => ({
  ...initAnimalState,
  addBear: () =>
    set(state => ({
      bears: get().fishes <= 0 ? state.bears + 1 : state.bears + get().fishes,
    })),
  addBearFish: () =>
    set(state => ({
      bears: get().fishes <= 0 ? state.bears + 1 : state.bears + get().fishes,
      fishes: get().fishes + 1,
    })),
  killBear: () =>
    set(state => ({bears: state.bears <= 0 ? 0 : state.bears - 1})),
});
