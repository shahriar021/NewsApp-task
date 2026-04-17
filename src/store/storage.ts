import { MMKV } from 'react-native-mmkv';

export const mmkvStorage = new MMKV({
  id: 'news-app-storage',
  encryptionKey: 'your-secret-key-optional',
});