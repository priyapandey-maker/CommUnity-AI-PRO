import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from '@/layouts';
import { LandingPage, SubmitIncidentPage, DecisionPage, LedgerPage, AuthorityDashboard } from '@/pages';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone full-screen page */}
        <Route path="/" element={<LandingPage />} />

        {/* Pages that share the AppLayout (Navbar + content wrapper) */}
        <Route element={<AppLayout />}>
          <Route path="/submit" element={<SubmitIncidentPage />} />
          <Route path="/decision/:id" element={<DecisionPage />} />
          <Route path="/ledger" element={<LedgerPage />} />
          <Route path="/authority" element={<AuthorityDashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
