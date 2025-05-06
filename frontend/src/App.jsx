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
import BackToTop from './Components/BackToTop/BackToTop';

const Home = () => (
  <div className="container">
    <Hero />
    <Title subTitle="Our Program" title="What we Offer" />
    <Programs />
    <Title subTitle="About Us" title="Who We Are" />
    <About />
    <Title subTitle="Gallery" title="Events that we made Perfect" />
    <Events />
    <Title subTitle="Testimonial" title="Smooth Events, Happy Clients!" />
    <Testimonials />
    <Title subTitle="Contact" title="Get in touch!" />
    <Contact />
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

// Layout component to handle authenticated state
const AppContent = () => {
  return (
    <ErrorBoundary>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/events" element={<Events />} />
        <Route path="/testimonials" element={<Testimonials />} />
        
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
