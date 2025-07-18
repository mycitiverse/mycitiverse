import './App.css';
import { Routes, Route } from 'react-router-dom'; // Remove Router import here
import ReactGA from "react-ga4";
import GAListener from './components/GAListener';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import EventsPage from './pages/EventsPage';
import AddCommunityHall from "./pages/AddCommunityHall";
import OrganizePage from './pages/OrganizePage';
import EventDetails from './pages/EventDetails';
import CityFeedPage from './pages/CityFeedPage';
import AddCityUpdate from './pages/AddCityUpdate';
import UserEventsList from "./components/UserEventsList";
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import CommunityHallPage from "./pages/CommunityHallPage";
import BookHallPage from "./pages/BookHallPage";
import MyBookings from "./pages/MyBookings";
import CityUpdateDetails from "./pages/CityUpdateDetails"
import CommunityHallDetails from "./components/CommunityHallDetails";
import MyEvents from "./pages/MyEvents";
import FeedbackButton from "./components/FeedbackButton";
import Preloader from "./components/Preloader";
import BookEventPage from "./pages/BookEventPage";
import PrivateRoute from "./routes/PrivateRoute";
import UserProfile from './auth/UserProfile';
import SignupPage from './auth/SignupPage';
import PhoneLogin from './auth/PhoneLogin';
import ForgotPassword from './auth/ForgotPassword';
import LoginPage from './auth/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import HallOwnerDashboard from './pages/HallOwnerDashboard';
import TermsAndConditions from "./pages/policies/TermsAndConditions";
import PrivacyPolicy from "./pages/policies/PrivacyPolicy";
import RefundPolicy from "./pages/policies/RefundPolicy";
import Disclaimer from "./pages/policies/Disclaimer";
import ScrollToTop from "./components/ScrollToTop";
import RecentlyAddedHalls from "./components/RecentlyAddedHalls";
import RecentlyAddedEvents from "./components/RecentlyAddedEvents";
import BookingConfirmationPage from "./pages/BookingConfirmationPage";
import BookingScanner from "./components/BookingScanner";
import OrganizerDashboard from "./components/OrganizerDashboard";
import LaunchCelebrationModal from "./pages/LaunchCelebrationModal";
import React from 'react';

function HomePage() {

const [showLaunchModal, setShowLaunchModal] = React.useState(true);

  return (
    <>

{showLaunchModal && (
        <LaunchCelebrationModal onClose={() => setShowLaunchModal(false)} />
      )}

      <Hero />
      <RecentlyAddedEvents />
      <RecentlyAddedHalls />
      <Features />
      <CTA />
    </>
  );
}

ReactGA.initialize("G-89JFJMJH1W");
ReactGA.event({
  category: 'User',
  action: 'Clicked Contact Button',
  label: 'Contact Page'
});


function App() {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });

  return (
    <AuthProvider>
        <GAListener /> {/* Track all route changes */}
      <Navbar />
      <Preloader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/community-hall" element={<CommunityHallPage />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/city-feed" element={<CityFeedPage />} />
        <Route path="/city-feed/:id" element={<CityUpdateDetails />} />
        <Route path="/community-hall/:id" element={<CommunityHallDetails />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />



        {/* 🔒 Admin + Auth Protected */}
        <Route path="/organize" element={
          <AdminRoute>
            <ProtectedRoute><OrganizePage /></ProtectedRoute>
          </AdminRoute>
        } />
        <Route path="/add-hall" element={
          <AdminRoute>
            <ProtectedRoute><AddCommunityHall /></ProtectedRoute>
          </AdminRoute>
        } />
        <Route path="/add-update" element={
          <AdminRoute>
            <ProtectedRoute><AddCityUpdate /></ProtectedRoute>
          </AdminRoute>
        } />
        <Route path="/admin/scanner" element={
          <AdminRoute>
            <ProtectedRoute><BookingScanner /></ProtectedRoute>
          </AdminRoute>
        } />

        {/* 🔒 Authenticated Users Only */}
        <Route path="/book-hall/:id" element={
          <PrivateRoute>
            <BookHallPage />
          </PrivateRoute>
        } />
        <Route path="/book-event/:id" element={
          <PrivateRoute>
            <BookEventPage />
          </PrivateRoute>
        } />
        <Route path="/my-bookings" element={
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        } />
        <Route path="/my-events" element={
          <PrivateRoute>
            <MyEvents />
          </PrivateRoute>
        } />
        <Route path="/my-events-list" element={
          <PrivateRoute>
            <UserEventsList />
          </PrivateRoute>
        } />
        <Route path="/hall-dashboard" element={
          <PrivateRoute>
            <HallOwnerDashboard />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <UserProfile />
          </PrivateRoute>
        } />
        <Route path="/booking/confirmation/:type/:bookingId" element={
          <PrivateRoute>
          <BookingConfirmationPage />
          </PrivateRoute>
        } />
        <Route path="/organizer-dashboard" element={
          <PrivateRoute>
          <OrganizerDashboard />
          </PrivateRoute>
        } />

      </Routes>
      <FeedbackButton />
      <Footer />
    </AuthProvider>
  );
}

export default App;
