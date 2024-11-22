import {MMKV} from 'react-native-mmkv';
// import generatePassword from '../../utils/passwordGenerator';

const mmkv = new MMKV();

export const zustandMMKVStorage = {
  setItem: (name, value) => {    
    mmkv.set(name, value);
  },
  getItem: name => {
    const value = mmkv.getString(name);
    return value !== null ? value : null;
  },
  removeItem: name => {
    mmkv.delete(name);
  },
  getAllKeys: () => {
    const allKeys = mmkv.getAllKeys();
    console.log('Stored keys:', allKeys);
  },
};
