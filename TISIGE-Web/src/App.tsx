import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { AprovacaoPage } from '@/pages/AprovacaoPage';
import { ControleLCPage } from '@/pages/ControleLCPage';
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage';
import { GestaoLcFinalGeralPage } from '@/pages/GestaoLcFinalGeralPage';
import { GestaoLcFinalPage } from '@/pages/GestaoLcFinalPage';
import { GerenciaDashboardPage } from '@/pages/GerenciaDashboardPage';
import { HomePage } from '@/pages/HomePage';
import { LCApprovalDetailPage } from '@/pages/LCApprovalDetailPage';
import { LCFormPage } from '@/pages/LCFormPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { OsInexistentePage } from '@/pages/OsInexistentePage';
import { PcpFabricacaoPage } from '@/pages/PcpFabricacaoPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AdminRoute } from '@/routes/AdminRoute';
import { GuestRoute, ProtectedRoute } from '@/routes/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/controle-lc" element={<ControleLCPage />} />
          <Route path="/lc/new" element={<LCFormPage />} />
          <Route path="/lc/:id/edit" element={<LCFormPage />} />
          <Route path="/lc/:id" element={<LCFormPage />} />
          <Route path="/gestao-lc-final" element={<GestaoLcFinalPage />} />
          <Route path="/gestao-lc-final-geral" element={<GestaoLcFinalGeralPage />} />
          <Route path="/aprovacao" element={<AprovacaoPage />} />
          <Route path="/aprovacao/:id" element={<LCApprovalDetailPage />} />
          <Route path="/pcp-fabricacao" element={<PcpFabricacaoPage />} />
          <Route path="/gerencia" element={<GerenciaDashboardPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
          </Route>
          <Route path="/notificacoes" element={<NotificationsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/os-inexistente/:os" element={<OsInexistentePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
