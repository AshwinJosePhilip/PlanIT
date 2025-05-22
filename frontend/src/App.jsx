import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import Layout from './Components/Layout/Layout';
import Hero from './Components/Hero/Hero';
import About from './Components/About/About';
import Events from './Components/Events/Events';
import Testimonials from './Components/Testimonials/Testimonials';
import Programs from './Components/Programs/Programs';
import Contact from './Components/Contact/Contact';
import Title from './Components/Title/Title';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import BackToTop from './Components/BackToTop/BackToTop';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Profile from './Components/Profile/Profile';
import ServiceManagement from './Components/Admin/Services/ServiceManagement';
import EditProgram from './Components/Admin/Programs/EditProgram.jsx';

const Home = () => (
  <div className="container">
    <div id="home">
      <Hero />
    </div>
    <Title subTitle="Our Programs" title="What we Offer" />
    <div id="programs">
      <Programs />
    </div>
    <Title subTitle="About Us" title="Who We Are" />
    <div id="about">
      <About />
    </div>
    <Title subTitle="Gallery" title="Events that we made Perfect" />
    <div id="events">
      <Events />
    </div>
    <Title subTitle="Testimonial" title="Smooth Events, Happy Clients!" />
    <div id="testimonials">
      <Testimonials />
    </div>
    <Title subTitle="Contact" title="Get in touch!" />
    <div id="contact">
      <Contact />
    </div>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

// App content with proper layout and routing
const AppContent = () => {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public routes */}
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/events" element={<Events />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/programs/:programId" element={<Programs />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin/programs/:programId/services" element={
            <AdminRoute>
              <ServiceManagement />
            </AdminRoute>
          } />
          <Route path="/admin/programs/:programId/edit" element={
            <AdminRoute>
              <EditProgram />
            </AdminRoute>
          } />
          <Route path="/admin/*" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Route>
      </Routes>
      <BackToTop />
      <ToastContainer position="bottom-right" />
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
