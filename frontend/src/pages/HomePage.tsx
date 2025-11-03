import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Clock,
  Users,
  Brain,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Star,
  Calendar,
  BarChart3,
  UserPlus,
} from "lucide-react";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description:
        "Machine learning algorithms predict accurate wait times based on historical data and current queue status.",
      color: "text-primary-600 bg-primary-100",
    },
    {
      icon: Clock,
      title: "Real-time Updates",
      description:
        "Get instant notifications about your appointment status and queue position updates.",
      color: "text-secondary-600 bg-secondary-100",
    },
    {
      icon: Users,
      title: "Priority Management",
      description:
        "Special priority handling for elderly, disabled, and emergency cases with dedicated queues.",
      color: "text-accent-600 bg-accent-100",
    },
    {
      icon: Globe,
      title: "Multi-language Support",
      description:
        "Available in English, Sinhala, and Tamil to serve all communities effectively.",
      color: "text-success-600 bg-success-100",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your personal information is protected with enterprise-grade security and encryption.",
      color: "text-error-600 bg-error-100",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Book appointments in seconds with our streamlined interface and optimized performance.",
      color: "text-warning-600 bg-warning-100",
    },
  ];

  const stats = [
    { number: "50,000+", label: "Appointments Booked", icon: Calendar },
    { number: "95%", label: "Customer Satisfaction", icon: Star },
    { number: "30min", label: "Average Wait Reduction", icon: Clock },
    { number: "24/7", label: "System Availability", icon: BarChart3 },
  ];

  const testimonials = [
    {
      name: "Priya Perera",
      role: "Government Employee",
      content:
        "The AI predictions are incredibly accurate. I saved hours of waiting time!",
      rating: 5,
    },
    {
      name: "Dr. Rajesh Kumar",
      role: "Healthcare Professional",
      content:
        "This system has revolutionized how we manage patient appointments.",
      rating: 5,
    },
    {
      name: "Amara Silva",
      role: "Senior Citizen",
      content:
        "Easy to use interface and priority booking made my experience seamless.",
      rating: 5,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Smart Queue
                <span className="block text-secondary-200">Management</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-primary-100 leading-relaxed">
                Skip the wait with AI-powered appointment booking. Get accurate
                wait time predictions and seamless service delivery.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/register"
                  className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="btn-outline border-white text-blue hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className=" backdrop-blur-lg rounded-2xl p-100">
                <div className="space-y-4">
                  <img
                    src="src/public/assets/hero-image.png"
                    alt="Hero"
                    className="w-full h-auto rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart Queue?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of appointment booking with cutting-edge
              technology and user-centric design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                >
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-6 ${feature.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to book your appointment and skip the queue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Choose Service
              </h3>
              <p className="text-gray-600">
                Select the government service or healthcare appointment you need
                from our comprehensive list.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pick Time Slot
              </h3>
              <p className="text-gray-600">
                Our AI suggests the best available time slots with accurate wait
                time predictions.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-success-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Arrive & Serve
              </h3>
              <p className="text-gray-600">
                Arrive at your scheduled time, show your token, and get served
                without the wait.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied users who've transformed their service
              experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Skip the Queue?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their service
            experience. Start booking smarter appointments today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-secondary text-lg px-8 py-4 hover:scale-105 transform transition-all duration-200"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Create Free Account
            </Link>
            <Link
              to="/contact"
              className="btn-outline border-white text-blue hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
