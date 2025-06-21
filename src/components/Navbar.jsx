import { useState } from 'react';
import Button from "./ui/Button";
import { Menu } from "lucide-react";
import { Link } from 'react-router-dom';
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAILS } from '../constants/adminConfig';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("user");
        window.location.href = "/login";
      })
      .catch((error) => console.error("Logout Error:", error));
  };

  // Base links available to all users (logged in or not)
  const baseLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'City Feed', href: '/city-feed' },
    { name: 'Community Halls', href: '/community-hall' },
    ...(!currentUser ? [{ name: 'Login/Sign Up', href: '/login' }] : [])
  ];

  // Admin-only links
  const adminLinks = [
    { name: 'Add City Update', href: '/add-update' },
    { name: 'Add Community Hall', href: '/add-hall' },
    { name: 'Organize', href: '/organize' },
    { name: 'My Events', href: '/my-events' },
    { name: 'Hall Booking Dashboard', href: '/hall-dashboard' },
    { name: 'Owner Dashboard', href: '/owner-dashboard' },
  ];

  // Add "My Bookings" for logged in users
  const userLinks = currentUser ? [
    { name: 'My Bookings', href: '/my-hall-bookings' },
    { name: 'Profile', href: '/profile' }
  ] : [];

  // Combine all links
  const navLinks = [...baseLinks, ...userLinks, ...(isAdmin ? adminLinks : [])];

  return (
    <nav className="sticky top-0 z-50 bg-yellow-400 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/mylogo.png" alt="MyCitiverse Logo" className="h-14 w-auto" />
              <span className="text-white font-bold text-2xl">MyCitiverse</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-white hover:bg-yellow-500 px-3 py-2 rounded-md text-l font-medium transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
            
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="text-white hover:bg-yellow-500 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-yellow-400 pb-3">
            <div className="px-2 pt-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={closeMenu}
                  className="block text-white hover:bg-yellow-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  {link.name}
                </Link>
              ))}

              {currentUser ? (
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="w-full text-left text-white hover:bg-red-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block text-white hover:bg-yellow-500 px-3 py-2 rounded-md text-base font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
