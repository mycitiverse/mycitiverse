import { useState, useEffect } from 'react';
import Button from "./ui/Button";
import { Menu } from "lucide-react";
import { Link } from 'react-router-dom';
import { db } from "../firebase";
import { useAuth } from '../contexts/AuthContext';
import { ADMIN_EMAILS } from '../constants/adminConfig';
import { doc, getDoc } from 'firebase/firestore';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState(null);
  const { currentUser } = useAuth();
  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Fetch role from Firestore if user is logged in
  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setRole(userSnap.data().role || "user");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setRole(null);
      }
    };

    fetchUserRole();
  }, [currentUser]);

  // Base links available to all users (logged in or not)
  const baseLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'City Feed', href: '/city-feed' },
    { name: 'Community Halls', href: '/community-hall' },
    ...(currentUser ? [] : [{ name: 'Login/Sign Up', href: '/login' }])
  ];

   // Role-based links
  const organizerLinks = role === 'organizer' ? [
    { name: 'Event Dashboard', href: '/organizer-dashboard' },
    { name: 'Organize', href: '/organize' },
    { name: 'My Events', href: '/my-events' },
    { name: 'Scanner', href:'/admin/scanner' },
  ] : [];

  const hallOwnerLinks = role === 'hall_owner' ? [
    { name: 'Hall Dashboard', href: '/hall-dashboard' },
    { name: 'Add Hall', href: '/add-hall' },
  ] : [];

  const influencerLinks = role === 'influencer' ? [
    { name: 'Add City Update', href: '/add-update' },
  ] : [];

  // Admin-only links
  const adminLinks = isAdmin ? [
    { name: 'Add City Update', href: '/add-update' },
    { name: 'Add Hall', href: '/add-hall' },
    { name: 'Organize', href: '/organize' },
    { name: 'My Events', href: '/my-events' },
    { name: 'Hall Dashboard', href: '/hall-dashboard' },
    { name: 'Event Dashboard', href: '/organizer-dashboard' },
    { name: 'Scanner', href: '/admin/scanner' },
  ] : [];

  // Add "My Bookings" for logged in users
  const userLinks = currentUser ? [
    { name: 'My Bookings', href: '/my-bookings' },
    { name: 'Profile', href: '/profile' }
  ] : [];

  // Combine all links
  const navLinks = [
    ...baseLinks, ...userLinks, ...organizerLinks, ...hallOwnerLinks, ...influencerLinks, ...adminLinks
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gold shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/mylogo.png" alt="MyCitiverse Logo" className="h-16 w-auto" />
              <span className="text-white text-2xl font-bold">
              ᗰƳᑕᎥ丅Ꭵᐯᗴᖇᔕᗴ
              </span>
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
          <div className="md:hidden bg-gold pb-3">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
