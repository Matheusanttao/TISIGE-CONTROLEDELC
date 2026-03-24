import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  ControleLC: undefined;
  LCForm: { mode: 'create' | 'edit' | 'view'; id?: string };
  GestaoLcFinal: { os?: string };
  GestaoLcFinalGeral: undefined;
  AprovacaoLC: undefined;
  LCApprovalDetail: { id: string };
  PcpFabricacao: undefined;
  GerenciaDashboard: undefined;
  AdminUsers: undefined;
  Notifications: undefined;
  Profile: undefined;
  OsInexistente: { os: string };
};

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
