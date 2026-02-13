
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import IncidentReport from './components/IncidentReport';
import Chat from './components/Chat';
import EmployeeManagement from './components/EmployeeManagement';
import Profile from './components/Profile';
import TimeSheet from './components/TimeSheet';
import Announcements from './components/Announcements';
import Onboarding from './components/Onboarding';

const AppRoutes = () => {
  const { currentUser } = useApp();
  const [hasOnboarded, setHasOnboarded] = useState(false);

  if (!hasOnboarded) {
      return <Onboarding onComplete={() => setHasOnboarded(true)} />;
  }

  if (!currentUser) {
    return <Login />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/incidents" element={<IncidentReport />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/timesheet" element={<TimeSheet />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
}
