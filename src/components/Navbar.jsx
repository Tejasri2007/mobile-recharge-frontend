import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white shadow-2xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">
              Recharge Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-gray-200 transition-colors duration-300 font-medium">
              Home
            </Link>
            <Link to="/recharge" className="hover:text-gray-200 transition-colors duration-300 font-medium">
              Recharge
            </Link>
            <Link to="/plans" className="hover:text-gray-200 transition-colors duration-300 font-medium">
              Plans
            </Link>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' ? (
                  <Link to="/admin-dashboard" className="hover:text-gray-200 transition-colors duration-300 font-medium">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/history" className="hover:text-gray-200 transition-colors duration-300 font-medium">
                    History
                  </Link>
                )}
                <Link to="/profile" className="hover:text-gray-200 transition-colors duration-300 font-medium">
                  Profile
                </Link>
                <span className="text-gray-100">Welcome, {user?.name}</span>
                <button 
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-gray-200 transition-colors duration-300 font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-700 rounded-lg mt-2 p-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-gray-200 transition-colors duration-300">Home</Link>
              <Link to="/recharge" className="hover:text-gray-200 transition-colors duration-300">Recharge</Link>
              <Link to="/plans" className="hover:text-gray-200 transition-colors duration-300">Plans</Link>
              {isLoggedIn ? (
                <>
                  {user?.role === 'admin' ? (
                    <Link to="/admin-dashboard" className="hover:text-gray-200 transition-colors duration-300">Dashboard</Link>
                  ) : (
                    <Link to="/history" className="hover:text-gray-200 transition-colors duration-300">History</Link>
                  )}
                  <Link to="/profile" className="hover:text-gray-200 transition-colors duration-300">Profile</Link>
                  <span className="text-gray-100">Welcome, {user?.name}</span>
                  <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors duration-300 text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-gray-200 transition-colors duration-300">Login</Link>
                  <Link to="/signup" className="bg-white text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-300 text-center font-bold">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;