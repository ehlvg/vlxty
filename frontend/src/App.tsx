import type { ReactNode } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './pages/Login';
import TeamsPage from './pages/TeamsPage';
import ProjectPage from './pages/ProjectPage';
import SettingsPage from './pages/SettingsPage';
import Header from './components/Header';
import './index.css';

function Protected({ children }: { children: ReactNode }) {
  const { state } = useApp();
  if (!state.currentUser) return <Navigate to="/login" replace />;
  return children;
}

function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={<Protected><SettingsPage /></Protected>} />
      <Route path="/team/:teamId/project/:projectId" element={<Protected><ProjectPage /></Protected>} />
      <Route path="/*" element={<Protected><TeamsPage /></Protected>} />
    </Routes>
  );
}

function Wrapper() {
  const { state } = useApp();
  return (
    <div className={state.theme}>
      <Header />
      <Router />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Wrapper />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
