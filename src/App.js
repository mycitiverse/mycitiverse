import './App.css';
import { Routes, Route } from 'react-router-dom'; // Remove Router import here
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
import LoginPage from "./pages/LoginPage";
import UserEventsList from "./components/UserEventsList";
import { AuthProvider } from './contexts/AuthContext';
import AdminRoute from './components/AdminRoute';
import CommunityHallPage from "./pages/CommunityHallPage";
import BookHallPage from "./pages/BookHallPage";
import MyHallBookings from "./pages/MyHallBookings";
import CityUpdateDetails from "./pages/CityUpdateDetails"


function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/community-halls" element={<CommunityHallPage />} />
        <Route path="/organize" element={<AdminRoute><ProtectedRoute> <OrganizePage /> </ProtectedRoute></AdminRoute>} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/add-hall" element={<AdminRoute><ProtectedRoute> <AddCommunityHall /> </ProtectedRoute></AdminRoute>} />
        <Route path="/city-feed" element={<CityFeedPage />} />
        <Route path="/add-update" element={<AdminRoute><ProtectedRoute> <AddCityUpdate /> </ProtectedRoute></AdminRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-events" element={<UserEventsList />} />
        <Route path="/book-hall/:id" element={<BookHallPage />} />
        <Route path="/my-hall-bookings" element={<MyHallBookings />} />
        <Route path="/city-feed/:id" element={<CityUpdateDetails />} />

      
      </Routes>
      <Footer />
    </AuthProvider>
  );
}

export default App;
