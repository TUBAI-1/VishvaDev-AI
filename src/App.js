import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import FaceAuth from './components/FaceAuth';
import ChatDashboard from './components/ChatDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/signin" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-medical-50 to-primary-50">
          <Routes>
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/chat" element={<PrivateRoute><ChatDashboard /></PrivateRoute>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/face-auth" element={<FaceAuth />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 