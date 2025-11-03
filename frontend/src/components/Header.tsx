import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, User, Settings, LogOut, Clock, Globe, Menu, X, Info, Phone, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(false);
        setLanguageDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 const navigationItems = [
  // Citizen or no user
  ...(user?.role === 'CITIZEN' || !user
    ? [
        { name: t('nav.home'), path: '/', icon: Home },
        ...(user?.role === 'CITIZEN'
          ? [{ name: t('Dashboard'), path: '/dashboard', icon: User }]
          : []),
        { name: 'About Us', path: '/about', icon: Info },
        { name: 'Contact Us', path: '/contact', icon: Phone },
      ]
    : []),

  // Admin / Staff
  ...(user?.role === 'ADMIN' || user?.role === 'STAFF'
    ? [
        { name: t('nav.admin'), path: '/admin', icon: Settings },
        { name: t('Password Setting'), path: '/password-settings', icon: Settings },
        { name: 'Messages', path: '/admin/messages', icon: Mail },
      ]
    : []),
];


  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/30'
          : 'bg-white/80 backdrop-blur-sm border-b border-gray-200/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center mr-10">
            <div className="flex-shrink-0 flex items-center">
              <div className="relative">
                <Clock className="h-8 w-8 text-primary-600 animate-pulse" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900 animate-fade-in">{t('app.title')}</h1>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 transform scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* User & Mobile Menu */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Selector - Desktop */}
            <div className="hidden sm:flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 dropdown-container">
              <Globe className="h-4 w-4 text-gray-500" />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-sm border-none focus:ring-0 focus:outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>

            {/* Language Selector - Mobile */}
            <div className="md:hidden dropdown-container relative">
              <button
                onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Globe className="h-5 w-5 text-gray-600" />
              </button>
              {languageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    English
                  </button>
                  <button
                    onClick={() => changeLanguage('si')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    සිංහල
                  </button>
                  <button
                    onClick={() => changeLanguage('ta')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    தமிழ்
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Logged in user info - Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                  <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-medium">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="hidden md:flex items-center text-gray-500 hover:text-red-500 transition-all duration-300 transform hover:scale-110"
                  title={t('nav.logout')}
                >
                  <LogOut className="h-5 w-5" />
                </button>

                {/* Logged in user info - Mobile */}
                <div className="md:hidden flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-medium">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    title={t('nav.logout')}
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Avatar Icon for login/register dropdown */}
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center shadow-md hover:bg-gray-400 transition"
                  >
                    <User className="h-5 w-5 text-white" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                      <NavLink
                        to="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('Login')}
                      </NavLink>
                      <NavLink
                        to="/register"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {t('Register')}
                      </NavLink>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="px-4 py-4 space-y-4">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </NavLink>
              );
            })}
            {user && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center px-3 py-2">
                  <div className="h-10 w-10 bg-gradient-to-r from-primary-600 to-purple-600 rounded-full flex items-center justify-center shadow-md mr-3">
                    <span className="text-white text-sm font-medium">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px);} to {opacity:1; transform: translateY(0);} }
          @keyframes slideDown { from { opacity:0; transform:translateY(-20px);} to {opacity:1; transform:translateY(0);} }
          .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
          .animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
          .delay-100 { animation-delay:0.1s; }
          .delay-200 { animation-delay:0.2s; }
          
          /* Responsive improvements */
          @media (max-width: 640px) {
            .max-w-7xl {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;