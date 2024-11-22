import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {
  createBearSlice,
  createFishSlice,
  createMainSlice,
  createStorageSlice,
  createTokenSlice,
  resetStore,
  shallowObject,
} from './store';
import {zustandMMKVStorage} from './storage/mmkv';
import deepmerge from 'deepmerge';
export const useBoundStore = create(
  persist(
    (...a) => ({
      ...createBearSlice(...a),
      ...createFishSlice(...a),
      ...createMainSlice(...a),
      ...createTokenSlice(...a),
      ...createStorageSlice(...a),
      ...resetStore(...a),
      ...shallowObject(...a),
    }),
    {
      name: 'skia-player-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      version: 1,
      // partialize: (state) => {
      //   const partialState = Object.fromEntries(
      //     Object.entries(state).filter(([key]) => !['fishes'].includes(key))
      //   );
      //   // console.log('Persisting state:', partialState);
      //   return partialState;
      // },

      // merge: (persistedState, currentState) => {
      //   console.log({persistedState});
      //   console.log({currentState});
      //   const newMergedData = deepmerge.all([
      //     persistedState.objectRight,
      //     currentState.objectLeft,
      //   ]);
      //   console.log('merge', newMergedData.address.geo);
      //   return newMergedData;
      // },
    },
  ),
);
