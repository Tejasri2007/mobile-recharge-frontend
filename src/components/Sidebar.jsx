import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-20 left-4 z-50 bg-gradient-to-r from-gray-600 to-gray-800 text-white p-3 rounded-full shadow-lg hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-110 md:hidden"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 md:relative md:w-48`}>
        
        {/* Sidebar Header */}
        <div className="p-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              
                <span className="text-gray-600 font-bold text-lg"></span>
              
              <div>
                <h2 className="text-base font-bold">Menu</h2>
                {isLoggedIn && (
                  <p className="text-gray-100 text-xs">Hi, {user?.name}</p>
                )}
              </div>
            </div>
            <button 
              onClick={toggleSidebar}
              className="md:hidden text-white hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4">
          <div className="space-y-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-600">Home</span>
            </Link>

            <Link 
              to="/recharge" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
              onClick={() => setIsOpen(false)}
            >
              
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-700">Recharge</span>
            </Link>

            <Link 
              to="/plans" 
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
              onClick={() => setIsOpen(false)}
            >
              
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-800">Plans</span>
            </Link>

            {isLoggedIn && (
              user?.role === 'admin' ? (
                <Link 
                  to="/admin-dashboard" 
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-500">Dashboard</span>
                </Link>
              ) : (
                <>
                  <Link 
                    to="/history" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-500">History</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-500">Profile</span>
                  </Link>
                </>
              )
            )}

            {!isLoggedIn && (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                  onClick={() => setIsOpen(false)}
                >

                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-600">Login</span>
                </Link>

                <Link
                  to="/signup"
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
                  onClick={() => setIsOpen(false)}
                >

                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-700">Sign Up</span>
                </Link>
              </>
            )}


          </div>

          {/* Quick Stats */}
          <div className="mt-6 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Stats</h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Success</span>
                <span className="text-xs font-bold text-gray-600">99.9%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Time</span>
                <span className="text-xs font-bold text-gray-700">5 sec</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Support</span>
                <span className="text-xs font-bold text-gray-800">24/7</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;