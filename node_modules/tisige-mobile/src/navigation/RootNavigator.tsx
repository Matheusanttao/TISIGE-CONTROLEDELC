import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/colors';
import { AdminUsersScreen } from '../screens/AdminUsersScreen';
import { AprovacaoLCScreen } from '../screens/AprovacaoLCScreen';
import { ControleLCScreen } from '../screens/ControleLCScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { GerenciaDashboardScreen } from '../screens/GerenciaDashboardScreen';
import { GestaoLcFinalGeralScreen } from '../screens/GestaoLcFinalGeralScreen';
import { GestaoLcFinalScreen } from '../screens/GestaoLcFinalScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LCApprovalDetailScreen } from '../screens/LCApprovalDetailScreen';
import { LCFormScreen } from '../screens/LCFormScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { OsInexistenteScreen } from '../screens/OsInexistenteScreen';
import { PcpFabricacaoScreen } from '../screens/PcpFabricacaoScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.bgElevated,
    text: colors.text,
    border: colors.border,
  },
};

export function RootNavigator() {
  const user = useAuthStore((s) => s.user);

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        {user == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ControleLC" component={ControleLCScreen} />
            <Stack.Screen name="LCForm" component={LCFormScreen} />
            <Stack.Screen name="GestaoLcFinal" component={GestaoLcFinalScreen} />
            <Stack.Screen name="GestaoLcFinalGeral" component={GestaoLcFinalGeralScreen} />
            <Stack.Screen name="AprovacaoLC" component={AprovacaoLCScreen} />
            <Stack.Screen name="LCApprovalDetail" component={LCApprovalDetailScreen} />
            <Stack.Screen name="PcpFabricacao" component={PcpFabricacaoScreen} />
            <Stack.Screen name="GerenciaDashboard" component={GerenciaDashboardScreen} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="OsInexistente" component={OsInexistenteScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
