import {create} from 'zustand';

export const useBearStore = create(set => ({
  showBar: true,
  setShowBar: showBar => set({showBar}),
}));
