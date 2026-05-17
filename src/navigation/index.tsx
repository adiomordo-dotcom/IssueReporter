import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { IssueBoardScreen, IssueDetailsScreen, CreateIssueModal, SummaryScreen } from '../components'
import { IssueStackParams, TabParams } from './types'

const Stack = createNativeStackNavigator<IssueStackParams>()
const Tab = createBottomTabNavigator<TabParams>()

const IssueStack = () => (
  <Stack.Navigator >
    <Stack.Screen name="IssueBoard" component={IssueBoardScreen} />
    <Stack.Screen
      name="IssueDetails"
      component={IssueDetailsScreen}
      options={{ headerShown: true, title: 'Issue Details' }}
    />
    <Stack.Screen
      name="CreateIssue"
      component={CreateIssueModal}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
)

export const RootNavigator = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Issues" component={IssueStack} />
    <Tab.Screen name="Summary" component={SummaryScreen} options={{ headerShown: true, title: 'Summary' }} />
  </Tab.Navigator>
)