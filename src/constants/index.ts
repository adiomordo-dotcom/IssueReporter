import { Platform } from 'react-native';
import { IssueStatus } from '../types';

const WS_PORT = 9090;

export const WS_URL = Platform.OS === 'android' ? `ws://10.0.2.2:${WS_PORT}` : `ws://localhost:${WS_PORT}`

export const SEVERITY_COLORS: Record<'low' | 'medium' | 'high', string> = {
    low: '#2E7D32',
    medium: '#EF6C00',
    high: '#C62828',
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
}

export const STATUS_ORDER: IssueStatus[] = ['open', 'in_progress', 'resolved'];