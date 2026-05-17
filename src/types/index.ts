export type IssueSeverity = 'low' | 'medium' | 'high';
export type IssueStatus = 'open' | 'in_progress' | 'resolved';
export type ConnectionStatus = 'connected' | 'disconnected';

export interface Issue {
    id: string;
    title: string;
    room: string;
    severity: IssueSeverity;
    status: IssueStatus;
    createdAt: number;
    reportedBy: string;
}