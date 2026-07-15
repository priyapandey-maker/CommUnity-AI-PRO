import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/layouts';
import { LandingPage, SubmitIncidentPage, DecisionPage, LedgerPage, AuthorityDashboard, CitizenPortal, LoginPage, RegisterPage } from '@/pages';
import { AuthProvider } from '@/contexts';
import { ProtectedRoute, RoleRoute } from '@/components';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Standalone full-screen pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Pages that share the AppLayout (Navbar + content wrapper) */}
          <Route element={<AppLayout />}>
            
            {/* Protected Routes (Any authenticated user) */}
            <Route path="/submit" element={
              <ProtectedRoute>
                <SubmitIncidentPage />
              </ProtectedRoute>
            } />
            <Route path="/portal" element={
              <ProtectedRoute>
                <CitizenPortal />
              </ProtectedRoute>
            } />
            
            {/* Ledger and Decision can be public or protected depending on design, 
                but we'll leave them unprotected for transparency unless specified otherwise. */}
            <Route path="/decision/:id" element={<DecisionPage />} />
            <Route path="/ledger" element={<LedgerPage />} />
            
            {/* Role-Restricted Routes */}
            <Route path="/authority" element={
              <RoleRoute allowedRoles={['AUTHORITY', 'ADMIN']}>
                <AuthorityDashboard />
              </RoleRoute>
            } />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
