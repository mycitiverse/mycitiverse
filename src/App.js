import './App.css';
import { Routes, Route } from 'react-router-dom'; // Remove Router import here
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import CTA from './components/CTA';
import Footer from './components/Footer';
import EventsPage from './pages/EventsPage';
import OrganizePage from './pages/OrganizePage';
import EventDetails from './pages/EventDetails';
import CityFeedPage from './pages/CityFeedPage';
import AddCityUpdate from './pages/AddCityUpdate';
import LoginPage from "./pages/LoginPage";

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
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/organize" element={<OrganizePage />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/city-feed" element={<CityFeedPage />} />
        <Route path="/add-update" element={<AddCityUpdate />} />
        <Route path="/login" element={<LoginPage />} />
      
      </Routes>
      <Footer />
    </>
  );
}

export default App;
