// components/Footer.tsx
import React from "react";
import { Link} from "react-router-dom";
import { Clock } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-primary-400" />
              <div className="ml-3">
                <h3 className="text-xl font-bold">Smart Queue Management</h3>
                <p className="text-gray-400">
                  Efficient Appointment Booking System
                </p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Revolutionizing queue management with AI-powered wait time
              predictions and seamless appointment booking for government
              services and healthcare.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-300">
              <p>📧 info@smartqueue.gov.lk</p>
              <p>📞 +94 11 234 5678</p>
              <p>📍 Jaffna, Sri Lanka</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Smart Queue Management System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
