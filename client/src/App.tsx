import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { ScrollToTop } from './components/ScrollToTop.js';
import { Login } from './pages/Login.js';
import { Signup } from './pages/Signup.js';
import { Home } from './pages/Home.js';
import { MembersDirectory } from './pages/MembersDirectory.js';
import { MemberProfile } from './pages/MemberProfile.js';
import { ProjectShowcase } from './pages/ProjectShowcase.js';
import { ProjectDetails } from './pages/ProjectDetails.js';
import { CollaborationMarketplace } from './pages/CollaborationMarketplace.js';
import { CollaborationDetails } from './pages/CollaborationDetails.js';
import { CommunityEvents } from './pages/CommunityEvents.js';
import { EventDetails } from './pages/EventDetails.js';
import { PrivacyPolicy } from './pages/PrivacyPolicy.js';
import { TermsOfService } from './pages/TermsOfService.js';
import { CookiePolicy } from './pages/CookiePolicy.js';
import { CommunityGuidelines } from './pages/CommunityGuidelines.js';
import { Changelog } from './pages/Changelog.js';
import { SystemStatus } from './pages/SystemStatus.js';
import { HelpCenter } from './pages/HelpCenter.js';
import { PublicLayout } from './layouts/PublicLayout.js';
import { DashboardLayout } from './layouts/DashboardLayout.js';
import { DashboardOverview } from './pages/DashboardOverview.js';
import { MyProjects } from './pages/MyProjects.js';
import { ProjectForm } from './pages/ProjectForm.js';
import { MyCollaborations } from './pages/MyCollaborations.js';
import { CollaborationForm } from './pages/CollaborationForm.js';
import { ApplicationsDashboard } from './pages/ApplicationsDashboard.js';
import { MyEvents } from './pages/MyEvents.js';
import { EventForm } from './pages/EventForm.js';
import { DashboardSettings } from './pages/DashboardSettings.js';
import { ActivityDashboard } from './pages/ActivityDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { UserManagement } from './pages/UserManagement.js';
import { ModerationQueue } from './pages/ModerationQueue.js';
import { PlatformAnalytics } from './pages/PlatformAnalytics.js';
import { PageNotFound } from './pages/PageNotFound.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes wrapped in PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectShowcase />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/members" element={<MembersDirectory />} />
            <Route path="/members/:id" element={<MemberProfile />} />
            <Route path="/collaborate" element={<CollaborationMarketplace />} />
            <Route path="/collaborate/:id" element={<CollaborationDetails />} />
            <Route path="/events" element={<CommunityEvents />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/guidelines" element={<CommunityGuidelines />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/status" element={<SystemStatus />} />
            <Route path="/help" element={<HelpCenter />} />
          </Route>

          {/* Auth Routes (standalone screen layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Dashboard Routes wrapped in DashboardLayout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="projects" element={<MyProjects />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="collaborations" element={<MyCollaborations />} />
            <Route path="collaborations/new" element={<CollaborationForm />} />
            <Route path="collaborations/edit/:id" element={<CollaborationForm />} />
            <Route path="applications" element={<ApplicationsDashboard />} />
            <Route path="events" element={<MyEvents />} />
            <Route path="events/new" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="activity" element={<ActivityDashboard />} />
            <Route path="settings" element={<DashboardSettings />} />
            
            {/* Admin specific panels */}
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/users" element={<UserManagement />} />
            <Route path="admin/moderation" element={<ModerationQueue />} />
            <Route path="admin/analytics" element={<PlatformAnalytics />} />
          </Route>
          
          {/* Fallback redirection to 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
