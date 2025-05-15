import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import Programs from './Components/Programs/Programs';
import About from './Components/About/About';
import Events from './Components/Events/Events';
import Testimonials from './Components/Testimonials/Testimonials';
import Contact from './Components/Contact/Contact';
import Footer from './Footer/Footer';
import Title from './Components/Title/Title';
import LoginForm from './Components/LoginForm/LoginForm';
import RegistrationForm from './Components/RegistrationForm/RegistrationForm';
import BackToTop from './Components/BackToTop/BackToTop';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Profile from './Components/Profile/Profile';
import WeddingServices from './Components/Programs/WeddingServices/WeddingServices';

const Home = () => (
  <div className="container">
    <div id="home">
      <Hero />
    </div>
    <Title subTitle="Our Program" title="What we Offer" />
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

// Layout component to handle authenticated state
const AppContent = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/events" element={<Events />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/programs/wedding" element={<WeddingServices />} />
        
        {/* Protected Routes */}
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />
        <Route
          path="/programs"
          element={
            <ProtectedRoute>
              <Programs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route path="/" element={<AdminDashboard />} />
                <Route path="programs" element={<AdminDashboard activeTab="programs" />} />
                <Route path="events" element={<AdminDashboard activeTab="events" />} />
                <Route path="users" element={<AdminDashboard activeTab="users" />} />
                <Route path="settings" element={<AdminDashboard activeTab="settings" />} />
              </Routes>
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
      <BackToTop />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ErrorBoundary>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
