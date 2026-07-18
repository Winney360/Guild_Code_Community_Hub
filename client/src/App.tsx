import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { Login } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { Home } from './pages/Home.js';
import { MembersDirectory } from './pages/MembersDirectory.js';
import { MemberProfile } from './pages/MemberProfile.js';
import { ProjectShowcase } from './pages/ProjectShowcase.js';
import { PublicLayout } from './layouts/PublicLayout.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes wrapped in PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectShowcase />} />
            <Route path="/members" element={<MembersDirectory />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/collaborate" element={<div className="p-8 text-center text-xl font-bold">Ecosystem Collaboration (Under Construction)</div>} />
            <Route path="/events" element={<div className="p-8 text-center text-xl font-bold">Community Events (Under Construction)</div>} />
            <Route path="/privacy" element={<div className="p-8 text-center text-xl font-bold">Privacy Policy</div>} />
            <Route path="/terms" element={<div className="p-8 text-center text-xl font-bold">Terms of Service</div>} />
          </Route>

          {/* Auth Routes (standalone screen layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Dashboard Route Placeholder */}
          <Route path="/dashboard" element={<div className="p-8 text-center text-xl font-bold">Dashboard (Approved members only)</div>} />
          
          {/* Fallback redirection */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
