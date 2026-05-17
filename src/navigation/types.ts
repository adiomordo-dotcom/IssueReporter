import { NavigatorScreenParams } from '@react-navigation/native'

export type IssueStackParams = {
    IssueBoard: undefined
    IssueDetails: { issueId: string }
    CreateIssue: undefined
}

export type TabParams = {
    Issues: NavigatorScreenParams<IssueStackParams>
    Summary: undefined
}