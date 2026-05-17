import { create } from 'zustand';
import { Issue, ConnectionStatus } from '../types';

interface IssueStore {
    issues: Record<string, Issue>;
    connectionStatus: ConnectionStatus;
    isLoading: boolean;
    setIssues: (issues: Issue[]) => void;
    setConnectionStatus: (status: ConnectionStatus) => void;
    setIsLoading: (isLoading: boolean) => void;
    updateIssue: (updatedIssue: Issue) => void;
    addIssue: (newIssue: Issue) => void;
}

export const useIssueStore = create<IssueStore>((set) => ({
    issues: {},
    connectionStatus: 'disconnected',
    isLoading: false,
    setIssues: (issues) => set(() => {
        const issuesMap = issues.reduce((acc, issue) => {
            acc[issue.id] = issue;
            return acc;
        }, {} as Record<string, Issue>);
        return { issues: issuesMap };
    }),
    setConnectionStatus: (status) => set({ connectionStatus: status }),
    setIsLoading: (isLoading) => set({ isLoading }),
    updateIssue: (updatedIssue) => set((state) => ({
        issues: { ...state.issues, [updatedIssue.id]: updatedIssue }
    })),
    addIssue: (newIssue) => set((state) => ({
        issues: { ...state.issues, [newIssue.id]: newIssue }
    })),
}));