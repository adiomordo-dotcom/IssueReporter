import { Platform } from 'react-native';
const WS_PORT = 9090;
export const WS_URL = Platform.OS === 'android' ? `ws://10.0.2.2:${WS_PORT}` : `ws://localhost:${WS_PORT}`