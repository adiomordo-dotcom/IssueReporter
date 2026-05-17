import { Platform } from 'react-native';
export const WS_URL = Platform.OS === 'android' ? 'ws://10.0.2.2:8080' : 'ws://localhost:8080'